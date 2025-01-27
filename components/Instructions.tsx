import type React from 'react';
import ToggleSwitch from './ToggleSwitch';

interface InstructionsProps {
  isVisible: boolean;
  onToggle: (checked: boolean) => void;
}

const Instructions: React.FC<InstructionsProps> = ({ isVisible, onToggle }) => {
  if (!isVisible) {
    return (
      <div className="mb-8">
        <ToggleSwitch
          id="instructions-toggle"
          label="Toon instructies"
          checked={isVisible}
          onChange={onToggle}
        />
      </div>
    );
  }

  return (
    <div className="mb-8 bg-indigo-50 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-indigo-900">Gebruiksinstructies</h2>
        <ToggleSwitch
          id="instructions-toggle"
          label="Toon instructies"
          checked={isVisible}
          onChange={onToggle}
        />
      </div>
      <ul className="list-disc pl-5 space-y-2 text-indigo-800">
        <li>Gebruik de "Start met luisteren" knop om spraakherkenning te activeren.</li>
        <li>
          Zeg "beurt" gevolgd door het aantal punten om een nieuwe beurt toe te voegen (bijv. "beurt
          vijftien").
        </li>
        <li>Zeg "poedel" om een beurt met nul punten te registreren.</li>
        <li>
          U kunt ook "plus", "score", "+", "streak", of "reeks" gebruiken in plaats van "beurt".
        </li>
        <li>Gebruik het invoerveld om handmatig beurten toe te voegen.</li>
        <li>Bewerk of verwijder beurten met de knoppen in de beurtenlijst.</li>
        <li>
          Gebruik de schakelaars om het geluidssignaal en gesproken statistieken in/uit te
          schakelen.
        </li>
        <li>Klik op "Nieuw Spel Starten" om alle scores te resetten.</li>
        <li>
          De app probeert automatisch te voorkomen dat uw scherm uitschakelt tijdens het spel. Een
          indicator onder de instellingen toont of deze functie actief is. Als deze functie niet
          werkt, controleer dan uw browserinstellingen en machtigingen. Niet alle browsers
          ondersteunen deze functie.
        </li>
      </ul>
    </div>
  );
};

export default Instructions;
