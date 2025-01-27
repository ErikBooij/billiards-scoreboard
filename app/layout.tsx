import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Biljart Scorebord | Billiards Scoreboard',
  description:
    'Een interactief scorebord voor biljart met spraakherkenning | An interactive billiards scoreboard with speech recognition',
};

export default ({ children }: { children: React.ReactNode }): React.ReactNode => {
  return (
    <html lang="nl">
      <body className={inter.className}>{children}</body>
    </html>
  );
};
