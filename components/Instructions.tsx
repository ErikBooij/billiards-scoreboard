import type React from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InstructionsProps {
  isVisible: boolean;
  onToggle: (checked: boolean) => void;
}

const Instructions: React.FC<InstructionsProps> = ({ isVisible, onToggle }) => {
  return (
    <div className="mb-8">
      <button
        onClick={() => onToggle(!isVisible)}
        className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <div className="flex items-center space-x-2 text-indigo-900">
          <HelpCircle className="w-5 h-5" />
          <span className="font-semibold">Gebruiksinstructies</span>
        </div>
        {isVisible ? (
          <ChevronUp className="w-5 h-5 text-indigo-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-indigo-600" />
        )}
      </button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-4 bg-white rounded-lg shadow-md p-6 border border-indigo-100">
              <div className="grid gap-4">
                <InstructionItem
                  title="Spraakherkenning"
                  items={[
                    'Gebruik de "Start met luisteren" knop om spraakherkenning te activeren.',
                    'Zeg "beurt" gevolgd door het aantal punten (bijv. "beurt vijftien").',
                    'Zeg "poedel" om een beurt met nul punten te registreren.',
                    'Alternatieve commando\'s: "plus", "score", "+", "streak", of "reeks".',
                  ]}
                />
                <InstructionItem
                  title="Handmatige Bediening"
                  items={[
                    'Gebruik het invoerveld om handmatig beurten toe te voegen.',
                    'Bewerk of verwijder beurten met de knoppen in de beurtenlijst.',
                    'Klik op "Nieuw Spel Starten" om alle scores te resetten.',
                  ]}
                />
                <InstructionItem
                  title="Instellingen"
                  items={[
                    'Gebruik de schakelaars om het geluidssignaal en gesproken statistieken in/uit te schakelen.',
                    'De app probeert automatisch te voorkomen dat uw scherm uitschakelt tijdens het spel.',
                    'Een indicator onder de instellingen toont of deze functie actief is.',
                    'Als deze functie niet werkt, controleer dan uw browserinstellingen en machtigingen.',
                  ]}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface InstructionItemProps {
  title: string;
  items: string[];
}

const InstructionItem: React.FC<InstructionItemProps> = ({ title, items }) => (
  <div className="space-y-2">
    <h3 className="text-lg font-semibold text-indigo-900">{title}</h3>
    <ul className="list-disc pl-5 space-y-1.5 text-indigo-800">
      {items.map((item, index) => (
        <li key={index} className="text-sm leading-relaxed">
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export default Instructions;
