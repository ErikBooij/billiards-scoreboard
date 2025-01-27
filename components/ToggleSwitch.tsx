import type React from 'react';

interface ToggleSwitchProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, label, checked, onChange }) => {
  return (
    <label htmlFor={id} className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={`block w-10 h-6 rounded-full ${
            checked ? 'bg-indigo-600' : 'bg-gray-300'
          } transition-colors duration-200 ease-in`}
        ></div>
        <div
          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in transform ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        ></div>
      </div>
      <span className="ml-3 text-sm text-gray-700">{label}</span>
    </label>
  );
};

export default ToggleSwitch;
