
import React, { useState, useEffect } from 'react';
import { SimulationParams } from './types';
import { DEFAULT_PARAMS } from './constants';
import { calculateResults, formatScientific } from './services/physics';
import Visualizer from './components/Visualizer';
import Controls from './components/Controls';
import AnalysisChart from './components/AnalysisChart';
import { getPhysicsInsight } from './services/gemini';

const App: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [insight, setInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);

  const results = calculateResults(params, params.q1);
  const angleDeg = (results.alpha * 180 / Math.PI).toFixed(2);

  const handleGetInsight = async () => {
    setLoadingInsight(true);
    const text = await getPhysicsInsight(params, results);
    setInsight(text || '');
    setLoadingInsight(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8">
      <header className="max-w-6xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">סימולציית מעבדה: אלקטרוסטטיקה</h1>
        <p className="text-lg text-slate-600">חקר כוחות בין לוח טעון אינסופי לכדורים תלויים</p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Visualization and Results */}
        <div className="lg:col-span-8 space-y-8">
          <Visualizer params={params} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow border-t-4 border-blue-500">
              <p className="text-sm text-slate-500">שדה חשמלי (E)</p>
              <p className="text-xl font-bold">{formatScientific(params.sigma / (2 * 8.854e-12))} N/C</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow border-t-4 border-red-500">
              <p className="text-sm text-slate-500">זווית סטייה (α)</p>
              <p className="text-xl font-bold">{angleDeg}°</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow border-t-4 border-emerald-500">
              <p className="text-sm text-slate-500">tan(α)</p>
              <p className="text-xl font-bold">{results.tanAlpha.toFixed(3)}</p>
            </div>
          </div>

          <AnalysisChart params={params} />

          {/* AI Insight Section */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-indigo-900">ניתוח פיזיקלי חכם (AI)</h3>
              <button 
                onClick={handleGetInsight}
                disabled={loadingInsight}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loadingInsight ? 'מנתח...' : 'קבל תובנה'}
              </button>
            </div>
            {insight ? (
              <div className="bg-white/50 p-4 rounded-lg border border-indigo-200 animate-in fade-in duration-500">
                <p className="text-slate-800 leading-relaxed">{insight}</p>
              </div>
            ) : (
              <p className="text-slate-500 italic text-sm">לחץ על הכפתור כדי לקבל הסבר על המצב הנוכחי...</p>
            )}
          </div>
        </div>

        {/* Right Column: Controls */}
        <div className="lg:col-span-4 space-y-8">
          <Controls params={params} setParams={setParams} />
          
          <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"/></svg>
              מידע פיזיקלי
            </h4>
            <div className="text-sm space-y-4 opacity-90">
              <p>
                במצב שיווי משקל, פועלים על הכדור שלושה כוחות: כובד (mg), מתיחות בחוט (T), וכוח חשמלי (Fe).
              </p>
              <p className="font-mono bg-slate-700 p-2 rounded">
                tan(α) = Fₑ / F_g
              </p>
              <p>
                השדה החשמלי של לוח אינסופי הוא אחיד ואינו תלוי במרחק:
              </p>
              <p className="font-mono bg-slate-700 p-2 rounded">
                E = σ / (2ε₀)
              </p>
              <p>
                לכן הקשר בין tan(α) לבין צפיפות המטען σ הוא ליניארי לחלוטין.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto mt-12 pt-8 border-t border-slate-200 text-center text-slate-500 text-sm">
        <p>נבנה ככלי עזר ללימוד פיזיקה - מעבדה וירטואלית באלקטרוסטטיקה</p>
      </footer>
    </div>
  );
};

export default App;
