import React from 'react';
import { Sun, Thermometer, Aperture, CheckCircle2 } from 'lucide-react';
import { ScenarioType } from '../types';

interface ControlsProps {
  lightK: number;
  wbK: number;
  scenario: ScenarioType;
  onLightChange: (val: number) => void;
  onWbChange: (val: number) => void;
  onScenarioChange: (val: ScenarioType) => void;
  onAutoWhite: () => void;
}

const KELVIN_MIN = 2000;
const KELVIN_MAX = 10000;

const Slider: React.FC<{
  label: string;
  value: number;
  onChange: (val: number) => void;
  icon: React.ReactNode;
  colorClass: string;
}> = ({ label, value, onChange, icon, colorClass }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-sm font-medium text-gray-300">
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-mono text-white bg-white/10 px-2 py-0.5 rounded text-xs">
        {value}K
      </span>
    </div>
    <input
      type="range"
      min={KELVIN_MIN}
      max={KELVIN_MAX}
      step={100}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
    />
    <div className="flex justify-between text-[10px] text-gray-500 font-mono px-1">
      <span>Warm (2000K)</span>
      <span>Kalt (10000K)</span>
    </div>
  </div>
);

export const Controls: React.FC<ControlsProps> = ({
  lightK,
  wbK,
  scenario,
  onLightChange,
  onWbChange,
  onScenarioChange,
  onAutoWhite,
}) => {
  return (
    <div className="bg-zinc-900 border-t border-zinc-800 p-6 pb-8 md:pb-6 space-y-6 shadow-2xl relative z-10">
      
      {/* Scenario Selector */}
      <div className="flex justify-center pb-4">
        <div className="bg-black/50 p-1 rounded-lg flex gap-1">
          <button
            onClick={() => onScenarioChange(ScenarioType.SUNSET)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              scenario === ScenarioType.SUNSET
                ? 'bg-orange-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Szenario 1: Sonnenuntergang
          </button>
          <button
            onClick={() => onScenarioChange(ScenarioType.BLUE_HOUR)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              scenario === ScenarioType.BLUE_HOUR
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Szenario 2: Blaue Stunde
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Light Controls */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 text-orange-400">
            <Sun className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Vordergrundlicht (Lampe)</h3>
          </div>
          <Slider
            label="Farbtemperatur"
            value={lightK}
            onChange={onLightChange}
            icon={<Thermometer size={16} />}
            colorClass="text-orange-400"
          />
        </div>

        {/* Camera Controls */}
        <div className="space-y-4 relative">
             <div className="flex items-center justify-between mb-2 text-blue-400">
               <div className="flex items-center gap-2">
                 <Aperture className="w-5 h-5" />
                 <h3 className="text-sm font-bold uppercase tracking-wider">Kamera (Weißabgleich)</h3>
               </div>
               <button 
                  onClick={onAutoWhite}
                  className="flex items-center gap-1.5 text-xs bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 px-2 py-1 rounded transition-colors"
                  title="Match WB to Light"
                >
                  <CheckCircle2 size={12} />
                  AWB Match
               </button>
             </div>
          <Slider
            label="Weißabgleich (WB)"
            value={wbK}
            onChange={onWbChange}
            icon={<Thermometer size={16} />}
            colorClass="text-blue-400"
          />
        </div>
      </div>
    </div>
  );
};
