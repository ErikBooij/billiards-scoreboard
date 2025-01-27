import type React from 'react';

interface Turn {
  id: number;
  points: number;
}

interface ScoreDisplayProps {
  turns: Turn[];
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ turns }) => {
  const totalPoints = turns.reduce((sum, turn) => sum + turn.points, 0);
  const sortedPoints = [...turns].sort((a, b) => a.points - b.points);
  const bestTurn = sortedPoints[sortedPoints.length - 1]?.points || 0;
  const worstTurn = sortedPoints[0]?.points || 0;
  const averageTurn = turns.length ? totalPoints / turns.length : 0;

  return (
    <div className="mb-12 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-indigo-600 text-white p-8 text-center">
        <h2 className="text-8xl font-bold mb-2">{totalPoints}</h2>
        <p className="text-4xl opacity-90">
          in <span className="font-semibold">{turns.length}</span>{' '}
          {turns.length === 1 ? 'beurt' : 'beurten'}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6">
        <div className="bg-indigo-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2 text-indigo-900">Beste Beurt</h3>
          <p className="text-3xl text-indigo-600">{bestTurn}</p>
        </div>
        <div className="bg-indigo-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2 text-indigo-900">Slechtste Beurt</h3>
          <p className="text-3xl text-indigo-600">{worstTurn}</p>
        </div>
        <div className="bg-indigo-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2 text-indigo-900">Gemiddelde Beurt</h3>
          <p className="text-3xl text-indigo-600">{averageTurn.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
