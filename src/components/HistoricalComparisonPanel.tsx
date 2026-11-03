/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HistoricalBenchmark } from '../types/weather';
import { History } from 'lucide-react';

interface HistoricalComparisonPanelProps {
  benchmarks: HistoricalBenchmark[];
  currentRainfall24h: number;
  currentSoilSaturation: number;
  currentPeakTide: number;
}

export const HistoricalComparisonPanel: React.FC<HistoricalComparisonPanelProps> = ({
  benchmarks,
  currentRainfall24h,
  currentSoilSaturation,
}) => {
  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-400 mb-1">
          <span>Comparative Hydro-Informatics</span>
          <span aria-hidden="true">·</span>
          <span>Disaster Benchmark Archive</span>
          <span aria-hidden="true">·</span>
          <span>Noveleta Calibrations</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <History className="w-5 h-5 text-amber-400 shrink-0" />
          <span>Historical Floods & Calibration</span>
        </h3>
        <p className="text-[11px] sm:text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
          Noveleta’s flood risk model is calibrated against historical extreme events. By analyzing antecedent soil saturation, upland precipitation in Cavite, and Manila Bay tidal synchronization from prior typhoons, current data is contextualized against verified disaster thresholds.
        </p>
      </div>

      {/* Historical Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {benchmarks.map((event) => {
          const isPaeng = event.eventName.includes('Paeng');
          const isCarina = event.eventName.includes('Carina');
          const isBaseline = event.eventName.includes('Baseline');

          return (
            <div
              key={event.eventName}
              className={`p-4 sm:p-5 rounded-xl border flex flex-col justify-between space-y-3 sm:space-y-4 transition-all ${
                isPaeng
                  ? 'bg-rose-950/20 border-rose-800/60'
                  : isCarina
                  ? 'bg-orange-950/20 border-orange-800/60'
                  : isBaseline
                  ? 'bg-emerald-950/20 border-emerald-800/60'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-[11px] sm:text-xs font-mono text-slate-400">{event.date}</div>
                  <div className="text-[11px] sm:text-xs font-mono font-bold text-cyan-400 tabular-nums">
                    {event.similarityToCurrentPercent}% match
                  </div>
                </div>

                <div className="text-sm sm:text-base font-bold text-white leading-snug">
                  {event.eventName}
                </div>

                <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {event.impactSummary}
                </p>
              </div>

              {/* Benchmark Numbers */}
              <div className="space-y-1.5 sm:space-y-2 pt-2 border-t border-slate-800/80 text-[11px] sm:text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">24h Rainfall:</span>
                  <span className="font-mono font-semibold text-white tabular-nums">
                    {event.rainfall24hMm} mm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Upland Peak:</span>
                  <span className="font-mono font-semibold text-white tabular-nums">
                    {event.uplandRainfallMm} mm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Soil Saturation:</span>
                  <span className="font-mono font-semibold text-white tabular-nums">
                    {event.soilSaturationPercent}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tide Peak:</span>
                  <span className="font-mono font-semibold text-white tabular-nums">
                    +{event.peakTideMeters} m
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800/50">
                  <span className="text-slate-300 font-medium">Max Flood Depth:</span>
                  <span className={`font-mono font-bold tabular-nums ${isBaseline ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {event.maxFloodDepthMeters > 0 ? `${event.maxFloodDepthMeters} m` : '0.0 m (None)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Town Submerged:</span>
                  <span className="font-mono font-bold text-slate-200 tabular-nums">
                    {event.noveletaSubmergedPercent}% area
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct Calibration Comparison Bar */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] sm:text-xs gap-1">
          <span className="font-semibold text-white uppercase tracking-wider">
            Precipitation & Saturation Load vs Historical Thresholds
          </span>
          <span className="text-slate-400 font-mono text-[10px] sm:text-xs">
            Calibrated against STS Paeng (218mm Rain, 96% Sat)
          </span>
        </div>

        <div className="space-y-2">
          {/* Rainfall comparison */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] sm:text-xs text-slate-300">
              <span>24h Rain: {currentRainfall24h.toFixed(1)} mm</span>
              <span className="font-mono text-slate-400">
                Paeng: 218.4 mm ({Math.min(100, Math.round((currentRainfall24h / 218.4) * 100))}%)
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.max(5, (currentRainfall24h / 218.4) * 100))}%` }}
              />
            </div>
          </div>

          {/* Soil Saturation comparison */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] sm:text-xs text-slate-300">
              <span>Soil Saturation: {currentSoilSaturation}%</span>
              <span className="font-mono text-slate-400">
                Critical Runoff Threshold: 85%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  currentSoilSaturation > 80 ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${currentSoilSaturation}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
