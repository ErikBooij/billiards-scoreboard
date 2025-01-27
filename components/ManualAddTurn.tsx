import type React from 'react';
import { useState } from 'react';

interface ManualAddTurnProps {
  onAddTurn: (points: number) => void;
}

const ManualAddTurn: React.FC<ManualAddTurnProps> = ({ onAddTurn }) => {
  const [points, setPoints] = useState('');

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const numPoints = Number.parseInt(points, 10);
    if (!isNaN(numPoints)) {
      onAddTurn(numPoints);
      setPoints('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 flex">
      <input
        type="number"
        value={points}
        onChange={(e) => setPoints(e.target.value)}
        placeholder="Voer punten in"
        className="flex-grow border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-r-lg transition-colors duration-300"
      >
        Beurt Toevoegen
      </button>
    </form>
  );
};

export default ManualAddTurn;
