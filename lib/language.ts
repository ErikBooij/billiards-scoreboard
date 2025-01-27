export const supportedLanguages = {
  nl: 'Nederlands',
  en: 'English',
};

type Language = {
  locale: string;
  keywords: {
    turn: string[];
    turnCommonMisRecognitions: string[]; // These work identically to the turn keywords, but aren't listed in the instructions
    zeroPointsTurn?: Record<string, boolean>; // In case there's a specific keyword for marking a non-scoring turn, the value is true if it can be anywhere in a sentence
  };
  parsePointsFromSpeech: (number: string) => number;
  statsToSpeech: (points: number, turns: number, average: number) => string;
  translations: Translations;
};

type Translations = {
  turn: string;
  points: string;
  average: string;
};

export const languages: { [key in keyof typeof supportedLanguages]: Language } = {
  nl: {
    locale: 'nl-NL',
    keywords: {
      turn: ['beurt', 'plus', 'reeks', 'score', 'streak'],
      turnCommonMisRecognitions: ['bird', 'burt', 'bert', '+'],
      zeroPointsTurn: {
        poedel: true,
      },
    },
    translations: {
      honderd: '100',
      duizend: '1000',
    },
    parseNumber: (number: string) => Number.parseInt(number, 10),
    statsToSpeech: (number: number) => number.toString(),
  },
  en: {
    translations: {
      honderd: '100',
      duizend: '1000',
    },
    parseNumber: (number: string) => Number.parseInt(number, 10),
    statsToSpeech: (number: number) => number.toString(),
    locale: 'en-US',
  },
};
