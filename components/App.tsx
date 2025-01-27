// SAVE POINT 3: Stable version - 2025-01-25
// This version fixes the issue with speech recognition not respecting toggle states.
// All core functionalities should now work correctly.
import type React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import ScoreDisplay from './ScoreDisplay';
import TurnList from './TurnList';
import NewGameButton from './NewGameButton';
import ManualAddTurn from './ManualAddTurn';
import ToggleSwitch from './ToggleSwitch';
import Instructions from './Instructions';
import { useWakeLock } from '../hooks/useWakeLock';
import { Lock, LockOpen } from 'lucide-react';

interface Turn {
  id: number;
  points: number;
}

const wordToNumber: { [key: string]: number } = {
  nul: 0,
  een: 1,
  twee: 2,
  drie: 3,
  vier: 4,
  vijf: 5,
  zes: 6,
  zeven: 7,
  acht: 8,
  negen: 9,
  tien: 10,
  elf: 11,
  twaalf: 12,
  dertien: 13,
  veertien: 14,
  vijftien: 15,
  zestien: 16,
  zeventien: 17,
  achttien: 18,
  negentien: 19,
  twintig: 20,
  dertig: 30,
  veertig: 40,
  vijftig: 50,
  zestig: 60,
  zeventig: 70,
  tachtig: 80,
  negentig: 90,
};

const improveNumberRecognition = (text: string): string => {
  const improvements: { [key: string]: string } = {
    von: 'van',
    fun: 'van',
    phone: 'van',
    one: 'een',
    to: 'twee',
    tree: 'drie',
    for: 'vier',
    life: 'vijf',
    sex: 'zes',
    seven: 'zeven',
    act: 'acht',
    night: 'negen',
    teen: 'tien',
  };

  return text
    .split(' ')
    .map((word) => improvements[word.toLowerCase()] || word)
    .join(' ');
};

const removeDiacritics = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const parseSpokenNumber = (text: string): number | null => {
  const words = text.toLowerCase().split(' ');
  let result = 0;
  let currentNumber = 0;

  if (words.length === 1 && words[0] === 'nul') {
    return 0;
  }

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (word in wordToNumber) {
      currentNumber += wordToNumber[word];
    } else if (word === 'honderd') {
      currentNumber = currentNumber === 0 ? 100 : currentNumber * 100;
    } else if (word === 'duizend') {
      result += currentNumber === 0 ? 1000 : currentNumber * 1000;
      currentNumber = 0;
    } else if (word === 'en' || word === 'and') {
      // Skip 'en' (and) in Dutch numbers
      continue;
    } else if (word === 'min' || word === 'minus') {
      // Handle negative numbers
      result = -result;
      currentNumber = -currentNumber;
    } else {
      const num = Number.parseInt(word, 10);
      if (!isNaN(num)) {
        if (i + 1 < words.length && words[i + 1] === 'en') {
          // Handle cases like "twee en twintig" (twenty-two)
          currentNumber += num;
        } else {
          currentNumber = num;
        }
      }
    }
  }

  result += currentNumber;
  return result;
};

const playSound = (): void => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // 440 Hz - A4 note

  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
};

const keywordMatches = (text: string): boolean => {
  const keywords = [
    'beurt',
    'bird',
    'burt',
    'bert',
    'plus',
    'score',
    '+',
    'streak',
    'reeks',
    'poedel',
  ];
  return (
    keywords.some((keyword) => text.toLowerCase().startsWith(keyword)) ||
    text.toLowerCase().trim() === 'poedel'
  );
};

const App = (): React.ReactNode => {
  const [turns, setTurns] = useState<Turn[]>(() => {
    const savedTurns = localStorage.getItem('billiards_turns');
    if (savedTurns) {
      try {
        const parsedTurns = JSON.parse(savedTurns);
        if (
          Array.isArray(parsedTurns) &&
          parsedTurns.every(
            (turn) => typeof turn.id === 'number' && typeof turn.points === 'number',
          )
        ) {
          return parsedTurns;
        }
      } catch (error) {
        console.error('Error parsing saved turns:', error);
      }
    }
    return [];
  });
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedSpeech, setDetectedSpeech] = useState<string>('');
  const [playBeep, setPlayBeep] = useState(true);
  const [speakStats, setSpeakStats] = useState(true);
  const [isSpeakingStats, setIsSpeakingStats] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const playBeepRef = useRef(playBeep);
  const speakStatsRef = useRef(speakStats);
  const isListeningRef = useRef(false);

  useEffect(() => {
    playBeepRef.current = playBeep;
    speakStatsRef.current = speakStats;
  }, [playBeep, speakStats]);

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedPlayBeep = localStorage.getItem('billiards_playBeep');
    const savedSpeakStats = localStorage.getItem('billiards_speakStats');
    const savedShowInstructions = localStorage.getItem('billiards_showInstructions');

    if (savedPlayBeep !== null) {
      setPlayBeep(JSON.parse(savedPlayBeep));
    }
    if (savedSpeakStats !== null) {
      setSpeakStats(JSON.parse(savedSpeakStats));
    }
    if (savedShowInstructions !== null) {
      setShowInstructions(JSON.parse(savedShowInstructions));
    }
  }, []);

  useEffect(() => {
    // Save preferences to localStorage whenever they change
    localStorage.setItem('billiards_playBeep', JSON.stringify(playBeep));
    localStorage.setItem('billiards_speakStats', JSON.stringify(speakStats));
    localStorage.setItem('billiards_showInstructions', JSON.stringify(showInstructions));
  }, [playBeep, speakStats, showInstructions]);

  useEffect(() => {
    localStorage.setItem('billiards_turns', JSON.stringify(turns));
  }, [turns]);

  const speakSummary = useCallback((totalPoints: number, totalTurns: number, average: number) => {
    console.log('speakSummary called, speakStats:', speakStatsRef.current);
    if ('speechSynthesis' in window && speakStatsRef.current) {
      const utterance = new SpeechSynthesisUtterance();
      const pointText = totalPoints === 1 ? 'punt' : 'punten';
      const turnText = totalTurns === 1 ? 'beurt' : 'beurten';
      let averageText: string;
      if (average % 1 === 0) {
        averageText = Math.floor(average).toString();
      } else {
        const [wholePart, decimalPart] = average.toFixed(1).split('.');
        averageText = `${wholePart} komma ${decimalPart}`;
      }
      utterance.text = `${totalPoints} ${pointText} uit ${totalTurns} ${turnText}, gemiddeld ${averageText}.`;
      utterance.lang = 'nl-NL';
      utterance.rate = 1; // Normal speaking speed

      utterance.onstart = () => {
        setIsSpeakingStats(true);
      };

      utterance.onend = () => {
        setIsSpeakingStats(false);
      };

      speechSynthesis.speak(utterance);
    } else {
      console.log('Speech synthesis not available or speakStats is false');
    }
  }, []);

  const addTurn = useCallback(
    (points: number) => {
      setTurns((prevTurns) => {
        const newTurns = [...prevTurns, { id: Date.now(), points }];
        const totalPoints = newTurns.reduce((sum, turn) => sum + turn.points, 0);
        const totalTurns = newTurns.length;
        const average = totalPoints / totalTurns;

        if (playBeepRef.current) {
          playSound();
        }

        if (speakStatsRef.current) {
          setTimeout(
            () => {
              speakSummary(totalPoints, totalTurns, average);
            },
            playBeepRef.current ? 500 : 0,
          );
        }

        return newTurns;
      });
    },
    [speakSummary],
  );

  const editTurn = useCallback((id: number, newPoints: number) => {
    setTurns((prevTurns) => {
      const newTurns = prevTurns.map((turn) =>
        turn.id === id ? { ...turn, points: newPoints } : turn,
      );
      return newTurns;
    });
  }, []);

  const deleteTurn = useCallback((id: number) => {
    setTurns((prevTurns) => {
      const newTurns = prevTurns.filter((turn) => turn.id !== id);
      return newTurns;
    });
  }, []);

  const startNewGame = useCallback(() => {
    setTurns([]);
  }, []);

  const toggleListening = useCallback(() => {
    console.log(
      'toggleListening called. Current state - isListening:',
      isListeningRef.current,
      'isSpeakingStats:',
      isSpeakingStats,
      'recognition:',
      recognition,
    );
    if (!isListeningRef.current && !isSpeakingStats) {
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'nl-NL';
        recognition.maxAlternatives = 5;

        recognition.onstart = () => {
          isListeningRef.current = true;
          setIsListening(true);
          setError(null);
        };

        recognition.onend = () => {
          console.log('Speech recognition ended. isListening:', isListeningRef.current);
          if (isListeningRef.current) {
            console.log('Restarting speech recognition');
            recognition.start();
          } else {
            console.log('Not restarting speech recognition');
            setIsListening(false);
            setIsSpeaking(false);
          }
        };

        recognition.onresult = (event) => {
          if (!isSpeakingStats) {
            const last = event.results.length - 1;
            const text = removeDiacritics(event.results[last][0].transcript.trim());

            setIsSpeaking(true);
            setDetectedSpeech(text);

            if (event.results[last].isFinal) {
              setIsSpeaking(false);
              if (text.toLowerCase().includes('poedel')) {
                addTurn(0);
              } else if (keywordMatches(text)) {
                const pointsText = text
                  .replace(/^(beurt|bird|burt|bert|plus|score|\+|streak|reeks)/i, '')
                  .trim();
                const points = parseSpokenNumber(improveNumberRecognition(pointsText));
                if (points !== null) {
                  addTurn(points);
                }
              }
            }
          }
        };

        recognition.onerror = (event) => {
          console.error('Spraakherkenningsfout', event.error);
          setError(`Spraakherkenningsfout: ${event.error}`);
          // Don't set isListening to false here, let onend handle it
        };

        recognition.start();
        setRecognition(recognition);
      } else {
        setError('Spraakherkenning wordt niet ondersteund in deze browser.');
      }
    } else if (isListeningRef.current) {
      isListeningRef.current = false;
      setIsListening(false);
      if (recognition) {
        recognition.stop();
      }
      setIsSpeaking(false);
      setRecognition(null);
    }
  }, [isSpeakingStats, recognition, addTurn]);

  const { isScreenActiveEnabled, error: wakeLockError } = useWakeLock();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold mb-12 text-center text-indigo-900">Biljart Scorebord</h1>
      <Instructions isVisible={showInstructions} onToggle={setShowInstructions} />
      <ScoreDisplay turns={turns} />
      <div className="my-8">
        <NewGameButton onNewGame={startNewGame} />
      </div>
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <button
            onClick={toggleListening}
            className={`mb-4 sm:mb-0 px-6 py-3 rounded-full text-white font-semibold transition-colors duration-300 ${
              isListeningRef.current
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            }`}
            disabled={isSpeakingStats}
          >
            {isListeningRef.current ? 'Stop met luisteren' : 'Start met luisteren'}
          </button>
          {isListening && (
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full mr-2 ${isSpeaking ? 'bg-green-500' : 'bg-gray-300'}`}
              ></div>
              <span className="text-gray-700">
                {isSpeakingStats
                  ? 'Statistieken worden uitgesproken...'
                  : isSpeaking
                    ? 'Spraak gedetecteerd'
                    : 'Wachten op spraak...'}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ToggleSwitch
            id="beep-toggle"
            label="Geluidssignaal"
            checked={playBeep}
            onChange={setPlayBeep}
          />
          <ToggleSwitch
            id="stats-toggle"
            label="Gesproken statistieken"
            checked={speakStats}
            onChange={setSpeakStats}
          />
        </div>
      </div>
      <div className="mb-8 flex items-center justify-center">
        <div
          className={`flex items-center px-4 py-2 rounded-full ${
            isScreenActiveEnabled ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {isScreenActiveEnabled ? (
            <Lock className="w-4 h-4 mr-2" />
          ) : (
            <LockOpen className="w-4 h-4 mr-2" />
          )}
          <span className="text-sm font-medium">
            {isScreenActiveEnabled ? 'Scherm blijft actief' : 'Scherm kan uitschakelen'}
          </span>
        </div>
      </div>
      {(error || wakeLockError) && (
        <div className="mb-8 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <p>{error || wakeLockError}</p>
        </div>
      )}
      {detectedSpeech && (
        <div className="mb-8 bg-indigo-100 border-l-4 border-indigo-500 text-indigo-700 p-4 rounded">
          <p>
            <strong>Gedetecteerde spraak:</strong> {detectedSpeech}
          </p>
        </div>
      )}
      <ManualAddTurn onAddTurn={addTurn} />
      <TurnList turns={turns} onEditTurn={editTurn} onDeleteTurn={deleteTurn} />
    </div>
  );
};

export default App;
