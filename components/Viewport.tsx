import React from 'react';
import { getSubjectRelativeColor, getWbFilterColor } from '../utils/kelvin';
import { ScenarioConfig } from '../types';
import { InfoPanel } from './InfoPanel';

interface ViewportProps {
  lightK: number;
  wbK: number;
  config: ScenarioConfig;
  isComparing?: boolean;
}

export const Viewport: React.FC<ViewportProps> = ({ lightK, wbK, config, isComparing }) => {
  // 1. Subject Appearance: 
  // For an abstract white object, the color is exactly the calculated light/WB interaction.
  // We use opacity 1.0 to make the shape solid.
  const subjectColor = getSubjectRelativeColor(lightK, wbK, 1.0);

  // 2. Background Appearance: affected ONLY by the WB K (Light K does not hit the sun/sky)
  // We simulate WB by applying an overlay to the whole image.
  // Opacity is now handled inside getWbFilterColor for precise control.
  const globalWbColor = getWbFilterColor(wbK);

  return (
    <div className="relative w-full flex-1 overflow-hidden bg-black flex items-center justify-center">
      
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-300 ease-out"
        style={{ 
          backgroundImage: `url("${config.backgroundUrl}")`,
        }}
      >
        {/* WB Overlay for Background - Mimics camera processing on the scene */}
        <div 
          className="absolute inset-0 transition-colors duration-200 ease-linear pointer-events-none"
          style={{ 
            backgroundColor: globalWbColor,
            mixBlendMode: 'overlay',
          }}
        />
      </div>

      {/* Info Overlay */}
      <div className={`absolute top-4 left-4 right-4 z-20 flex justify-center md:justify-start transition-opacity duration-300 ${isComparing ? 'opacity-0' : 'opacity-100'}`}>
        <InfoPanel 
          description={config.description} 
          targetDescription={config.targetDescription}
        />
      </div>

      {/* Compare Mode Indicator */}
      {isComparing && (
        <div className="absolute top-8 left-0 right-0 z-30 flex justify-center pointer-events-none animate-in fade-in duration-200">
          <div className="bg-white/90 text-black px-6 py-2 rounded-full font-bold tracking-widest text-lg shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            ORIGINAL
          </div>
        </div>
      )}

      {/* The Subject (Geometric Abstract Person) */}
      <div className="relative z-10 h-[60%] md:h-[70%] aspect-square flex items-end justify-center pointer-events-none drop-shadow-2xl">
         <div className="flex flex-col items-center gap-4 transition-colors duration-200 ease-linear">
            {/* Head (Circle) */}
            <div 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full shadow-lg transition-colors duration-200"
              style={{ backgroundColor: subjectColor }}
            />
            
            {/* Body (Triangle) */}
            {/* Using borders to create a triangle. 
                border-bottom defines height and color. 
                border-left/right define width. */}
            <div 
              className="w-0 h-0 border-l-[80px] border-r-[80px] border-b-[200px] md:border-l-[100px] md:border-r-[100px] md:border-b-[260px] border-l-transparent border-r-transparent drop-shadow-lg transition-colors duration-200"
              style={{ borderBottomColor: subjectColor }}
            />
         </div>
      </div>
    </div>
  );
};