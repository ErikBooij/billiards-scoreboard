import type React from 'react';

interface NewGameButtonProps {
  onNewGame: () => void;
}

const NewGameButton: React.FC<NewGameButtonProps> = ({ onNewGame }) => {
  return (
    <button
      onClick={onNewGame}
      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
    >
      Nieuw Spel Starten
    </button>
  );
};

export default NewGameButton;
