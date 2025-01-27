import type React from 'react';
import { useState } from 'react';

interface Turn {
  id: number;
  points: number;
}

interface TurnListProps {
  turns: Turn[];
  onEditTurn: (id: number, newPoints: number) => void;
  onDeleteTurn: (id: number) => void;
}

const TurnList: React.FC<TurnListProps> = ({ turns, onEditTurn, onDeleteTurn }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const handleEdit = (turn: Turn): void => {
    setEditingId(turn.id);
    setEditValue(turn.points.toString());
  };

  const handleSave = (id: number): void => {
    const newPoints = Number.parseInt(editValue, 10);
    if (!isNaN(newPoints)) {
      onEditTurn(id, newPoints);
    }
    setEditingId(null);
  };

  return (
    <div className="mb-12 bg-white rounded-lg shadow-lg overflow-hidden">
      <h2 className="text-2xl font-bold p-6 bg-indigo-600 text-white">Beurtenlijst</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-indigo-100">
            <tr>
              <th className="p-3 text-left text-indigo-900">Beurt</th>
              <th className="p-3 text-left text-indigo-900">Punten</th>
              <th className="p-3 text-left text-indigo-900">Acties</th>
            </tr>
          </thead>
          <tbody>
            {[...turns].reverse().map((turn, index) => (
              <tr key={turn.id} className={index % 2 === 0 ? 'bg-indigo-50' : 'bg-white'}>
                <td className="p-3">{turns.length - index}</td>
                <td className="p-3">
                  {editingId === turn.id ? (
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  ) : (
                    turn.points
                  )}
                </td>
                <td className="p-3">
                  {editingId === turn.id ? (
                    <button
                      onClick={() => handleSave(turn.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600 transition-colors duration-300"
                    >
                      Opslaan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(turn)}
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600 transition-colors duration-300"
                    >
                      Bewerken
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteTurn(turn.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors duration-300"
                  >
                    Verwijderen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TurnList;
