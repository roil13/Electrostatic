
import React from 'react';
import { SimulationParams } from '../types';

interface ControlsProps {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
}

const Controls: React.FC<ControlsProps> = ({ params, setParams }) => {
  const updateParam = (key: keyof SimulationParams, value: any) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 space-y-6">
      <h3 className="text-xl font-bold text-slate-800 border-b pb-2">פרמטרים של המערכת</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            צפיפות מטען משטחית (σ): <span className="font-mono text-blue-600">{(params.sigma * 1e7).toFixed(2)} × 10⁻⁷ C/m²</span>
          </label>
          <input
            type="range"
            min="0.5"
            max="10"
            step="0.01"
            value={params.sigma * 1e7}
            onChange={(e) => updateParam('sigma', parseFloat(e.target.value) * 1e-7)}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            מטען הכדור q₁: <span className="font-mono text-red-600">{(params.q1 * 1e8).toFixed(2)} × 10⁻⁸ C</span>
          </label>
          <input
            type="range"
            min="-20"
            max="20"
            step="0.1"
            value={params.q1 * 1e8}
            onChange={(e) => updateParam('q1', parseFloat(e.target.value) * 1e-8)}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            מסת הכדור m₁: <span className="font-mono text-slate-600">{(params.m1 * 1000).toFixed(1)} gr</span>
          </label>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={params.m1 * 1000}
            onChange={(e) => updateParam('m1', parseFloat(e.target.value) / 1000)}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
          />
        </div>

        <div className="pt-4 border-t">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={params.showSecondBall}
              onChange={(e) => updateParam('showSecondBall', e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-semibold text-slate-700">הוסף ניסוי 2 (שני מטענים)</span>
          </label>
        </div>

        {params.showSecondBall && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
             <label className="block text-sm font-medium text-slate-700 mb-1">
                מטען הכדור q₂: <span className="font-mono text-emerald-600">{(params.q2 * 1e8).toFixed(2)} × 10⁻⁸ C</span>
              </label>
              <input
                type="range"
                min="-20"
                max="20"
                step="0.1"
                value={params.q2 * 1e8}
                onChange={(e) => updateParam('q2', parseFloat(e.target.value) * 1e-8)}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
          </div>
        )}
      </div>
    </div>
  );
};

export default Controls;
