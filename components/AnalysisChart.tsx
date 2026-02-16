
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SimulationParams } from '../types';
import { calculateResults } from '../services/physics';

interface AnalysisChartProps {
  params: SimulationParams;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-slate-200 shadow-2xl rounded-xl ring-1 ring-black/5 animate-in fade-in zoom-in duration-200">
        <div className="mb-2">
          <p className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">צפיפות מטען (σ)</p>
          <p className="text-blue-600 font-mono text-lg font-extrabold">
            {label} × 10⁻⁷ <span className="text-xs">C/m²</span>
          </p>
        </div>
        <div className="h-px bg-slate-100 w-full my-2"></div>
        <div>
          <p className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">תוצאת tan(α)</p>
          <p className="text-red-600 font-mono text-lg font-extrabold">
            {payload[0].value}
          </p>
        </div>
        <p className="mt-2 text-[10px] text-slate-400 italic">
          יחס ישר: σ ↑ ⇒ tan(α) ↑
        </p>
      </div>
    );
  }
  return null;
};

const AnalysisChart: React.FC<AnalysisChartProps> = ({ params }) => {
  const data = useMemo(() => {
    const points = [];
    // Calculate for sigma from 1.0 to 10.0 (x 10^-7)
    for (let s = 1.0; s <= 10.0; s += 0.5) {
      const currentSigma = s * 1e-7;
      const res = calculateResults({ ...params, sigma: currentSigma }, params.q1);
      points.push({
        sigma: s.toFixed(1),
        tanAlpha: parseFloat(res.tanAlpha.toFixed(4)),
      });
    }
    return points;
  }, [params.q1, params.m1, params.sigma]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 transition-all hover:shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">גרף ניתוח מגמות</h3>
          <p className="text-slate-500 text-sm font-medium">הקשר בין צפיפות המטען לזווית הסטייה</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
          <span className="text-blue-700 text-sm font-bold">מגמה: ליניארית (Linear)</span>
        </div>
      </div>
      
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="sigma" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
              label={{ value: 'σ (×10⁻⁷ C/m²)', position: 'insideBottom', offset: -10, fill: '#475569', fontSize: 13, fontWeight: 700 }} 
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
              label={{ value: 'tan(α)', angle: -90, position: 'insideLeft', offset: 10, fill: '#475569', fontSize: 13, fontWeight: 700 }} 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }} />
            <Line 
              type="monotone" 
              dataKey="tanAlpha" 
              stroke="#ef4444" 
              strokeWidth={4}
              name="tan(α) עבור q₁" 
              dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 7, strokeWidth: 0 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
        <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          תובנת המגמה הנצפית
        </h4>
        <p className="text-slate-600 text-sm leading-relaxed">
          כפי שניתן לראות בגרף, קיים קשר <strong>ליניארי ישר</strong> בין צפיפות המטען (σ) לבין הערך tan(α). 
          מבחינה פיזיקלית, מכיוון שהשדה החשמלי של לוח אינסופי תלוי ישירות ב-σ ($E = \sigma / 2\epsilon_0$), 
          והכוח החשמלי תלוי ב-$E$, כל הגדלה של צפיפות המטען מגדילה את הכוח החשמלי באותו יחס, מה שגורם לכדור לסטות רחוק יותר מהאנך.
        </p>
      </div>
    </div>
  );
};

export default AnalysisChart;
