
import React, { useRef, useEffect } from 'react';
import { SimulationParams } from '../types';
import { calculateResults } from '../services/physics';

interface VisualizerProps {
  params: SimulationParams;
}

const Visualizer: React.FC<VisualizerProps> = ({ params }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string,
    label: string
  ) => {
    const headLength = 10;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;

    // Line
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    // Label
    ctx.font = 'bold 12px Assistant, sans-serif';
    ctx.textAlign = 'center';
    const offset = 15;
    ctx.fillText(label, toX + Math.cos(angle) * offset, toY + Math.sin(angle) * offset + 4);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    
    ctx.clearRect(0, 0, width, height);

    const sheetX = width / 2;
    const margin = 50;
    const ceilingY = 50;

    // Draw Sheet
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(sheetX, margin);
    ctx.lineTo(sheetX, height - margin);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw "+" signs on sheet
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 20px Arial';
    for (let y = margin + 20; y < height - margin; y += 40) {
      ctx.fillText('+', sheetX - 10, y);
    }

    const drawBallWithForces = (charge: number, label: string, isRightSide: boolean) => {
      const results = calculateResults(params, charge);
      
      const direction = (charge > 0) ? 1 : -1;
      const anchorX = isRightSide ? sheetX + 100 : sheetX - 100;
      
      const angle = results.alpha * direction * (isRightSide ? 1 : -1);
      const visualL = params.L * 300; 
      
      const ballX = anchorX + Math.sin(angle) * visualL;
      const ballY = ceilingY + Math.cos(angle) * visualL;

      // Draw ceiling
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(anchorX - 30, ceilingY);
      ctx.lineTo(anchorX + 30, ceilingY);
      ctx.stroke();

      // Draw string
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(anchorX, ceilingY);
      ctx.lineTo(ballX, ballY);
      ctx.stroke();

      // Draw ball
      ctx.fillStyle = charge > 0 ? '#ef4444' : '#10b981';
      ctx.beginPath();
      ctx.arc(ballX, ballY, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw ball charge label
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(label, ballX, ballY + 5);

      // Force Vectors (FBD)
      // Scaling forces for visibility: Fg = 60px as baseline
      const fgLen = 60;
      const feLen = fgLen * results.tanAlpha;
      const tLen = Math.sqrt(fgLen ** 2 + feLen ** 2);

      // Fg: Downward
      drawArrow(ctx, ballX, ballY, ballX, ballY + fgLen, '#f59e0b', 'Fg');

      // Fe: Horizontal
      const feDirection = direction * (isRightSide ? 1 : -1);
      drawArrow(ctx, ballX, ballY, ballX + feLen * feDirection, ballY, '#3b82f6', 'Fe');

      // T: Along the string towards the anchor
      const tX = ballX - Math.sin(angle) * tLen;
      const tY = ballY - Math.cos(angle) * tLen;
      drawArrow(ctx, ballX, ballY, tX, tY, '#8b5cf6', 'T');
    };

    drawBallWithForces(params.q1, 'q1', true);
    if (params.showSecondBall) {
      drawBallWithForces(params.q2, 'q2', false);
    }

  }, [params]);

  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden relative">
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg text-xs border border-slate-200 z-10 shadow-sm">
        <p className="font-bold mb-2 text-slate-800">מקרא וקטורים:</p>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-4 h-0.5 bg-amber-500"></div>
          <span className="text-slate-600 font-semibold">Fg - כוח כובד (mg)</span>
        </div>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-4 h-0.5 bg-blue-500"></div>
          <span className="text-slate-600 font-semibold">Fe - כוח חשמלי (qE)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-violet-500"></div>
          <span className="text-slate-600 font-semibold">T - מתיחות (Resultant)</span>
        </div>
      </div>
      <canvas ref={canvasRef} className="w-full h-[450px] block" />
    </div>
  );
};

export default Visualizer;
