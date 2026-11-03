/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { HourlyForecastPoint } from '../types/weather';
import { Activity, CloudRain, Waves, Mountain, Hand } from 'lucide-react';

interface RiskForecastChartProps {
  data: HourlyForecastPoint[];
}

export const RiskForecastChart: React.FC<RiskForecastChartProps> = ({ data }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [visibleChannels, setVisibleChannels] = useState<{
    risk: boolean;
    rain: boolean;
    tide: boolean;
    watershed: boolean;
  }>({
    risk: true,
    rain: true,
    tide: true,
    watershed: true,
  });

  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 text-center text-slate-400 text-xs sm:text-sm">
        No forecast timeline data available.
      </div>
    );
  }

  // Chart Dimensions
  const svgWidth = 860;
  const svgHeight = 320;
  const paddingLeft = 45;
  const paddingRight = 35;
  const paddingTop = 30;
  const paddingBottom = 45;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const n = data.length;
  const getX = (index: number) => paddingLeft + (index / (n - 1)) * chartWidth;

  // Y for Risk (0 - 100%)
  const getYRisk = (val: number) => paddingTop + chartHeight - (val / 100) * chartHeight;

  // Bounds for secondary metrics
  const maxRain = Math.max(10, ...data.map((d) => d.precipitation * 1.3));
  const maxTide = Math.max(1.8, ...data.map((d) => (d.tideHeight + d.coastalSurge) * 1.25));
  const minTide = Math.min(-0.8, ...data.map((d) => d.tideHeight - 0.2));
  const maxRunoff = Math.max(60, ...data.map((d) => d.uplandRunoffRate * 1.2));

  const getYRain = (val: number) => paddingTop + chartHeight - (val / maxRain) * chartHeight;
  const getYTide = (val: number) => {
    const range = maxTide - minTide;
    return paddingTop + chartHeight - ((val - minTide) / range) * chartHeight;
  };
  const getYRunoff = (val: number) => paddingTop + chartHeight - (val / maxRunoff) * chartHeight;

  // Path generators
  const buildSmoothPath = (getYFunc: (d: HourlyForecastPoint) => number) => {
    if (data.length < 2) return '';
    return data.reduce((acc, point, i) => {
      const x = getX(i);
      const y = getYFunc(point);
      if (i === 0) return `M ${x} ${y}`;
      const prevX = getX(i - 1);
      const prevY = getYFunc(data[i - 1]);
      const cp1x = prevX + (x - prevX) / 2;
      const cp2x = prevX + (x - prevX) / 2;
      return `${acc} C ${cp1x} ${prevY}, ${cp2x} ${y}, ${x} ${y}`;
    }, '');
  };

  const riskPath = buildSmoothPath((d) => getYRisk(d.floodRiskScore));
  const rainPath = buildSmoothPath((d) => getYRain(d.precipitation));
  const tidePath = buildSmoothPath((d) => getYTide(d.tideHeight + d.coastalSurge));
  const runoffPath = buildSmoothPath((d) => getYRunoff(d.uplandRunoffRate));

  const riskArea = `${riskPath} L ${getX(n - 1)} ${paddingTop + chartHeight} L ${getX(0)} ${paddingTop + chartHeight} Z`;

  // Find peak risk hour
  let peakPoint = data[0];
  let peakIndex = 0;
  data.forEach((d, i) => {
    if (d.floodRiskScore > peakPoint.floodRiskScore) {
      peakPoint = d;
      peakIndex = i;
    }
  });

  const activePoint = hoverIndex !== null ? data[hoverIndex] : peakPoint;
  const activeX = hoverIndex !== null ? getX(hoverIndex) : getX(peakIndex);

  const toggleChannel = (key: keyof typeof visibleChannels) => {
    setVisibleChannels((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Helper for touch coordinate scrubbing on mobile
  const handleTouchScrub = (clientX: number, target: SVGSVGElement) => {
    const rect = target.getBoundingClientRect();
    const relX = ((clientX - rect.left) / rect.width) * svgWidth;
    const clampedX = Math.max(paddingLeft, Math.min(svgWidth - paddingRight, relX));
    const frac = (clampedX - paddingLeft) / chartWidth;
    const idx = Math.min(n - 1, Math.max(0, Math.round(frac * (n - 1))));
    setHoverIndex(idx);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-400 mb-1">
            <span>Hydro-Dynamic Prognosis</span>
            <span aria-hidden="true">·</span>
            <span>24-Hour Horizon</span>
            <span aria-hidden="true">·</span>
            <span>Cavite Basin Telemetry</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Hourly Compound Flood Risk & Surge Forecast
          </h2>
        </div>

        {/* Channel Visibility Toggles: Touch targets >= 40px */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => toggleChannel('risk')}
            className={`min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              visibleChannels.risk
                ? 'bg-rose-950/60 border-rose-600/70 text-rose-300'
                : 'bg-slate-950/40 border-slate-800 text-slate-400 opacity-60'
            }`}
          >
            <Activity className="w-3.5 h-3.5 shrink-0" />
            <span>Risk %</span>
          </button>

          <button
            onClick={() => toggleChannel('rain')}
            className={`min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              visibleChannels.rain
                ? 'bg-cyan-950/60 border-cyan-600/70 text-cyan-300'
                : 'bg-slate-950/40 border-slate-800 text-slate-400 opacity-60'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5 shrink-0" />
            <span>Rain</span>
          </button>

          <button
            onClick={() => toggleChannel('tide')}
            className={`min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              visibleChannels.tide
                ? 'bg-blue-950/60 border-blue-600/70 text-blue-300'
                : 'bg-slate-950/40 border-slate-800 text-slate-400 opacity-60'
            }`}
          >
            <Waves className="w-3.5 h-3.5 shrink-0" />
            <span>Tide</span>
          </button>

          <button
            onClick={() => toggleChannel('watershed')}
            className={`min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              visibleChannels.watershed
                ? 'bg-amber-950/60 border-amber-600/70 text-amber-300'
                : 'bg-slate-950/40 border-slate-800 text-slate-400 opacity-60'
            }`}
          >
            <Mountain className="w-3.5 h-3.5 shrink-0" />
            <span>Inflow</span>
          </button>
        </div>
      </div>

      {/* Real-time Probe HUD Banner - Responsive 2 to 5 columns */}
      <div className="p-3 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
        <div>
          <div className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-mono">Time Window</div>
          <div className="text-sm sm:text-base font-bold font-mono text-white tabular-nums">
            {activePoint.formattedTime}
          </div>
          <div className="text-[10px] sm:text-xs text-slate-400 truncate">
            {hoverIndex !== null ? 'Selected Hour' : 'Projected Peak'}
          </div>
        </div>

        <div>
          <div className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-mono">Risk Level</div>
          <div className="text-sm sm:text-base font-bold font-mono text-rose-400 tabular-nums">
            {activePoint.floodRiskScore}%
          </div>
          <div className="text-[10px] sm:text-xs uppercase font-medium text-slate-300 truncate">
            {activePoint.riskLevel}
          </div>
        </div>

        <div>
          <div className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-mono">Rain Rate</div>
          <div className="text-sm sm:text-base font-bold font-mono text-cyan-300 tabular-nums">
            {activePoint.precipitation} <span className="text-[10px] font-normal text-slate-400">mm/h</span>
          </div>
          <div className="text-[10px] sm:text-xs text-slate-400">
            {activePoint.precipitationProbability}% prob
          </div>
        </div>

        <div>
          <div className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-mono">Tide + Surge</div>
          <div className="text-sm sm:text-base font-bold font-mono text-blue-300 tabular-nums">
            {(activePoint.tideHeight + activePoint.coastalSurge).toFixed(2)} <span className="text-[10px] font-normal text-cyan-300">m MLLW</span>
          </div>
          <div className="text-[10px] sm:text-xs text-slate-400">
            Surge: +{activePoint.coastalSurge.toFixed(2)}m
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <div className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-mono">Upland Inflow</div>
          <div className="text-sm sm:text-base font-bold font-mono text-amber-300 tabular-nums">
            {activePoint.uplandRunoffRate} <span className="text-[10px] font-normal text-slate-400">m³/s</span>
          </div>
          <div className="text-[10px] sm:text-xs text-slate-400">
            Soil: {activePoint.soilSaturationPercent}% sat
          </div>
        </div>
      </div>

      {/* Mobile Swipe Prompt Indicator */}
      <div className="flex sm:hidden items-center justify-between text-[11px] text-cyan-400/90 font-mono">
        <span className="flex items-center gap-1">
          <Hand className="w-3.5 h-3.5" />
          <span>Touch & drag curve to scrub 24h</span>
        </span>
        <span className="text-slate-400">Scroll for later hours →</span>
      </div>

      {/* SVG Interactive Chart Canvas with Touch Handling */}
      <div
        ref={chartContainerRef}
        className="relative w-full overflow-x-auto select-none rounded-xl"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[620px] sm:min-w-[700px] cursor-crosshair touch-manipulation"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = ((e.clientX - rect.left) / rect.width) * svgWidth;
            const clampedX = Math.max(paddingLeft, Math.min(svgWidth - paddingRight, relX));
            const frac = (clampedX - paddingLeft) / chartWidth;
            const idx = Math.min(n - 1, Math.max(0, Math.round(frac * (n - 1))));
            setHoverIndex(idx);
          }}
          onMouseLeave={() => setHoverIndex(null)}
          onTouchStart={(e) => {
            if (e.touches.length > 0) {
              handleTouchScrub(e.touches[0].clientX, e.currentTarget);
            }
          }}
          onTouchMove={(e) => {
            if (e.touches.length > 0) {
              handleTouchScrub(e.touches[0].clientX, e.currentTarget);
            }
          }}
        >
          <defs>
            <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines and Threshold bands */}
          {/* 75% Critical Threshold */}
          <line
            x1={paddingLeft}
            y1={getYRisk(75)}
            x2={svgWidth - paddingRight}
            y2={getYRisk(75)}
            stroke="#e11d48"
            strokeDasharray="4 4"
            strokeWidth="1"
            opacity="0.4"
          />
          <text
            x={paddingLeft + 6}
            y={getYRisk(75) - 4}
            fill="#f43f5e"
            fontSize="10"
            fontFamily="monospace"
            opacity="0.8"
          >
            CRITICAL THRESHOLD (75%)
          </text>

          {/* 50% High Threshold */}
          <line
            x1={paddingLeft}
            y1={getYRisk(50)}
            x2={svgWidth - paddingRight}
            y2={getYRisk(50)}
            stroke="#f97316"
            strokeDasharray="4 4"
            strokeWidth="1"
            opacity="0.3"
          />
          <text
            x={paddingLeft + 6}
            y={getYRisk(50) - 4}
            fill="#fb923c"
            fontSize="10"
            fontFamily="monospace"
            opacity="0.7"
          >
            HIGH ALERT (50%)
          </text>

          {/* 25% Moderate Threshold */}
          <line
            x1={paddingLeft}
            y1={getYRisk(25)}
            x2={svgWidth - paddingRight}
            y2={getYRisk(25)}
            stroke="#334155"
            strokeWidth="1"
          />
          <text
            x={paddingLeft + 6}
            y={getYRisk(25) - 4}
            fill="#64748b"
            fontSize="10"
            fontFamily="monospace"
          >
            25% ADVISORY
          </text>

          {/* Baseline 0% */}
          <line
            x1={paddingLeft}
            y1={paddingTop + chartHeight}
            x2={svgWidth - paddingRight}
            y2={paddingTop + chartHeight}
            stroke="#475569"
            strokeWidth="1"
          />

          {/* Y Axis Labels (Left: Risk %) */}
          {[0, 25, 50, 75, 100].map((val) => (
            <text
              key={val}
              x={paddingLeft - 8}
              y={getYRisk(val) + 4}
              textAnchor="end"
              fill="#94a3b8"
              fontSize="10"
              fontFamily="monospace"
            >
              {val}%
            </text>
          ))}

          {/* Data Channels */}
          {/* 1. Tide + Surge Area / Line */}
          {visibleChannels.tide && (
            <path d={tidePath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 3" />
          )}

          {/* 2. Upland Runoff Line */}
          {visibleChannels.watershed && (
            <path d={runoffPath} fill="none" stroke="#f59e0b" strokeWidth="1.8" opacity="0.8" />
          )}

          {/* 3. Rain mm/h Line */}
          {visibleChannels.rain && (
            <path d={rainPath} fill="none" stroke="#06b6d4" strokeWidth="2" />
          )}

          {/* 4. Main Compound Risk Line + Area Fill */}
          {visibleChannels.risk && (
            <g>
              <path d={riskArea} fill="url(#riskGrad)" />
              <path d={riskPath} fill="none" stroke="#f43f5e" strokeWidth="3" />
            </g>
          )}

          {/* X Axis Time Labels */}
          {data.map((point, i) => {
            if (i % 3 !== 0 && i !== n - 1) return null;
            const x = getX(i);
            return (
              <g key={point.time}>
                <line
                  x1={x}
                  y1={paddingTop + chartHeight}
                  x2={x}
                  y2={paddingTop + chartHeight + 5}
                  stroke="#475569"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={paddingTop + chartHeight + 18}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {point.formattedTime}
                </text>
              </g>
            );
          })}

          {/* Active Vertical Crosshair Probe */}
          <line
            x1={activeX}
            y1={paddingTop}
            x2={activeX}
            y2={paddingTop + chartHeight}
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />

          {/* Active point marker on risk curve */}
          {visibleChannels.risk && (
            <circle
              cx={activeX}
              cy={getYRisk(activePoint.floodRiskScore)}
              r="6"
              fill="#f43f5e"
              stroke="#ffffff"
              strokeWidth="2"
            />
          )}

          {/* Peak Risk Indicator Pin if not currently scrubbing */}
          {hoverIndex === null && (
            <g>
              <rect
                x={getX(peakIndex) - 48}
                y={getYRisk(peakPoint.floodRiskScore) - 26}
                width="96"
                height="18"
                rx="4"
                fill="#881337"
                stroke="#f43f5e"
                strokeWidth="1"
              />
              <text
                x={getX(peakIndex)}
                y={getYRisk(peakPoint.floodRiskScore) - 13}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="9.5"
                fontFamily="monospace"
                fontWeight="bold"
              >
                PEAK {peakPoint.floodRiskScore}% ({peakPoint.formattedTime})
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Chart Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-rose-500 rounded-full" />
            <span className="text-slate-300">Compound Risk %</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-cyan-400 rounded-full" />
            <span>Rain (mm/h)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-blue-500 border-b border-dashed border-blue-400" />
            <span>Tide + Surge (m MLLW)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-amber-500 rounded-full" />
            <span>Discharge</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 italic hidden sm:block">
          Hover or tap on curve to scrub through 24-hour prognosis.
        </div>
      </div>
    </div>
  );
};
