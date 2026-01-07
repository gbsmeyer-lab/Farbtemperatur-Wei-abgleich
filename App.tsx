import React, { useState, useEffect } from 'react';
import { Viewport } from './components/Viewport';
import { Controls } from './components/Controls';
import { ScenarioType, ScenarioConfig } from './types';

// Constants for scenarios
const SCENARIOS: Record<ScenarioType, ScenarioConfig> = {
  [ScenarioType.SUNSET]: {
    id: ScenarioType.SUNSET,
    title: "Sonnenuntergang",
    description: "Anmoderation vor einem Sonnenuntergang. Der Himmel ist rötlich-warm.",
    // A clear landscape sunset
    backgroundUrl: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1920&auto=format&fit=crop",
    defaultLightK: 5600,
    defaultWbK: 5600,
    targetDescription: "Verstärken Sie das Rot des Himmels, aber halten Sie das Motiv neutralweiß. (Tipp: Licht & WB auf Tageslicht ca. 5600K-6500K oder höher)."
  },
  [ScenarioType.BLUE_HOUR]: {
    id: ScenarioType.BLUE_HOUR,
    title: "Blaue Stunde",
    description: "Anmoderation zur 'Blauen Stunde'. Der Himmel ist tiefblau.",
    // View of a city at dusk (Chicago skyline) - Reliable URL
    backgroundUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1920&auto=format&fit=crop",
    defaultLightK: 3200,
    defaultWbK: 3200,
    targetDescription: "Verstärken Sie das Blau des Himmels, bei neutralem Motiv. (Tipp: Licht & WB auf Kunstlicht ca. 3200K)."
  }
};

const App: React.FC = () => {
  const [scenario, setScenario] = useState<ScenarioType>(ScenarioType.SUNSET);
  const [lightK, setLightK] = useState<number>(5600);
  const [wbK, setWbK] = useState<number>(5600);
  const [isComparing, setIsComparing] = useState<boolean>(false);

  // Reset defaults when scenario changes
  useEffect(() => {
    const config = SCENARIOS[scenario];
    setLightK(config.defaultLightK);
    setWbK(config.defaultWbK);
  }, [scenario]);

  const handleScenarioChange = (newScenario: ScenarioType) => {
    setScenario(newScenario);
    setIsComparing(false); // Reset compare state on scenario change
  };

  const handleAutoWhite = () => {
    setWbK(lightK);
  };

  // Determine values to show in Viewport (User selected OR Original defaults)
  const activeLightK = isComparing ? SCENARIOS[scenario].defaultLightK : lightK;
  const activeWbK = isComparing ? SCENARIOS[scenario].defaultWbK : wbK;

  return (
    <div className="h-screen w-full flex flex-col bg-zinc-950 text-white overflow-hidden">
      {/* Header / Nav - Minimal */}
      <header className="absolute top-0 w-full z-50 p-4 pointer-events-none">
         <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold tracking-tight text-white/80 drop-shadow-md">
              CineColor <span className="text-blue-500">Lab</span>
            </h1>
         </div>
      </header>

      {/* Main Visual Viewport */}
      <Viewport 
        lightK={activeLightK} 
        wbK={activeWbK} 
        config={SCENARIOS[scenario]} 
        isComparing={isComparing}
      />

      {/* Interactive Controls */}
      <Controls 
        lightK={lightK} // Always pass user values to controls so sliders don't jump
        wbK={wbK}
        scenario={scenario}
        onLightChange={setLightK}
        onWbChange={setWbK}
        onScenarioChange={handleScenarioChange}
        onAutoWhite={handleAutoWhite}
        onCompareStart={() => setIsComparing(true)}
        onCompareEnd={() => setIsComparing(false)}
        isComparing={isComparing}
      />
    </div>
  );
};

export default App;