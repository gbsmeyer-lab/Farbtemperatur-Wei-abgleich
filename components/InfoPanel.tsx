import React from 'react';
import { Info } from 'lucide-react';

interface InfoPanelProps {
  description: string;
  targetDescription: string;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ description, targetDescription }) => {
  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 md:max-w-md">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-1" />
        <div className="space-y-2">
          <p className="text-sm text-gray-300 leading-relaxed">
            {description}
          </p>
          <div className="bg-blue-500/10 border-l-2 border-blue-500 pl-3 py-1">
            <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-1">
              Ziel
            </p>
            <p className="text-sm text-white">
              {targetDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
