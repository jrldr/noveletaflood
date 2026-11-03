/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TideSurgeData } from '../types/weather';
import { Waves, ArrowUpRight, ArrowDownRight, Anchor } from 'lucide-react';

interface CoastalTidePanelProps {
  tideSurge: TideSurgeData;
}

export const CoastalTidePanel: React.FC<CoastalTidePanelProps> = ({ tideSurge }) => {
  const getBackflowTheme = (status: TideSurgeData['estuaryBackflowStatus']) => {
    switch (status) {
      case 'critical_backflow':
        return {
          title: 'CRITICAL ESTUARY BACKFLOW',
          badgeText: 'Drainage Blocked',
          border: 'border-rose-800/80 bg-rose-950/40 text-rose-300',
          desc: 'Manila Bay tide and coastal surge elevation exceeds river stage. Gravity floodgates must close; river water will back up into coastal barangays.',
        };
      case 'restricted_outflow':
        return {
          title: 'RESTRICTED DRAINAGE OUTFLOW',
          badgeText: 'Head Loss / Sluggish',
          border: 'border-amber-800/60 bg-amber-950/30 text-amber-300',
          desc: 'High astronomical water level is reducing discharge velocity into Manila Bay. River level rising slowly.',
        };
      case 'free_drainage':
      default:
        return {
          title: 'FREE GRAVITY DRAINAGE',
          badgeText: 'Unimpeded Outfall',
          border: 'border-emerald-800/60 bg-emerald-950/30 text-emerald-300',
          desc: 'Tide level is low enough for unimpeded gravitational evacuation through river mouth and coastal sluice gates.',
        };
    }
  };

  const backflowTheme = getBackflowTheme(tideSurge.estuaryBackflowStatus);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-400 mb-1">
            <span>Manila Bay & Bacoor Bay</span>
            <span aria-hidden="true">·</span>
            <span>Noveleta Coastline</span>
            <span aria-hidden="true">·</span>
            <span>Tidal Datum</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Waves className="w-5 h-5 text-blue-400 shrink-0" />
            <span>Coastal Tide Level & Storm Surge Predictor</span>
          </h3>
        </div>

        <div className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 self-start ${backflowTheme.border}`}>
          <Anchor className="w-3.5 h-3.5 shrink-0" />
          <span>{backflowTheme.badgeText}</span>
        </div>
      </div>

      {/* Station, Datum & Timezone Reference Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
          <span>{tideSurge.stationName}</span>
        </div>
        <div className="flex items-center gap-2 text-cyan-300">
          <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-cyan-200 font-semibold">
            {tideSurge.timeZoneLabel}
          </span>
          <span className="text-slate-400 hidden sm:inline">Datum: MLLW = 0.00m (MSL = +0.72m)</span>
        </div>
      </div>

      {/* Main Grid: Telemetry Gauges + Station Photo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left: Tide Gauges & Metrics (7 cols) */}
        <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
            {/* Current Water Level (Tide + Surge) */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-[11px] sm:text-xs text-slate-400">Total Combined Water</div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-cyan-300 tabular-nums">
                  {tideSurge.totalCombinedWaterLevel.toFixed(2)}
                </span>
                <span className="text-[10px] sm:text-xs font-mono text-cyan-400 font-semibold">m MLLW</span>
              </div>
              <div className="text-[10px] sm:text-xs font-mono text-slate-400">
                Hydraulic: {tideSurge.totalCombinedMsl >= 0 ? '+' : ''}{tideSurge.totalCombinedMsl.toFixed(2)} m MSL
              </div>
            </div>

            {/* Astronomical Tide */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-[11px] sm:text-xs text-slate-400">Astronomical Tide</div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
                  {tideSurge.currentTideMeters.toFixed(2)}
                </span>
                <span className="text-[10px] sm:text-xs font-mono text-slate-300">m MLLW</span>
              </div>
              <div className="text-[10px] sm:text-xs font-mono text-slate-400 capitalize flex items-center gap-1">
                {tideSurge.phase === 'rising' ? (
                  <>
                    <ArrowUpRight className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span>Rising (Flood)</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>Falling (Ebb)</span>
                  </>
                )}
              </div>
            </div>

            {/* Coastal Surge Component */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 col-span-2 sm:col-span-1">
              <div className="text-[11px] sm:text-xs text-slate-400">Coastal Storm Surge</div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-blue-300 tabular-nums">
                  +{tideSurge.totalSurgeMeters.toFixed(2)}
                </span>
                <span className="text-[10px] sm:text-xs font-mono text-slate-400">m</span>
              </div>
              <div className="text-[10px] sm:text-xs font-mono text-slate-400 truncate">
                Wind: +{tideSurge.windDrivenSurgeMeters.toFixed(2)}m · Baro: +{tideSurge.barometricSurgeMeters.toFixed(2)}m
              </div>
            </div>
          </div>

          {/* Daily Astronomical Extremes (Today) & Upcoming Cycle */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px] sm:text-xs border-b border-slate-800/80 pb-2">
              <span className="font-semibold text-slate-200">Daily Astronomical Tide Schedule (Noveleta / Sangley Point)</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700/80 text-[10px] text-cyan-300 font-mono">
                PST (UTC+8)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Today's High Tide */}
              <div className="p-2.5 sm:p-3 rounded-lg bg-slate-900/60 border border-slate-800/90 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>High Tide</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 font-mono font-medium border border-cyan-800/50">
                    {tideSurge.todayHighTide?.time || '3:20 AM PST'}
                  </span>
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-white">
                  {(tideSurge.todayHighTide?.height ?? 1.11).toFixed(2)}{' '}
                  <span className="text-xs font-semibold text-cyan-400">m MLLW</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Backflow threshold · (+{((tideSurge.todayHighTide?.height ?? 1.11) - 0.72).toFixed(2)} m MSL)
                </div>
              </div>

              {/* Today's Low Tide */}
              <div className="p-2.5 sm:p-3 rounded-lg bg-slate-900/60 border border-slate-800/90 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>Low Tide</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 font-mono font-medium border border-blue-800/50">
                    {tideSurge.todayLowTide?.time || '12:40 PM PST'}
                  </span>
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-white">
                  {(tideSurge.todayLowTide?.height ?? -0.01).toFixed(2)}{' '}
                  <span className="text-xs font-semibold text-blue-300">m MLLW</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Gravity drainage window · ({((tideSurge.todayLowTide?.height ?? -0.01) - 0.72).toFixed(2)} m MSL)
                </div>
              </div>
            </div>

            {/* Upcoming Next Cycle Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] font-mono text-slate-400 border-t border-slate-900">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Upcoming Shift:</span>
                <span className="text-slate-200">
                  {tideSurge.phase === 'falling' ? 'Next Low' : 'Next High'} at {tideSurge.phase === 'falling' ? tideSurge.nextLowTideTime : tideSurge.nextHighTideTime}
                </span>
                <span className="text-cyan-400 font-semibold">
                  ({(tideSurge.phase === 'falling' ? tideSurge.nextLowTideMeters : tideSurge.nextHighTideMeters).toFixed(2)}m)
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <span>Phase:</span>
                <span className="text-cyan-300 font-semibold capitalize">
                  {tideSurge.phase === 'rising' ? 'Flood (Rising)' : tideSurge.phase === 'falling' ? 'Ebb (Falling)' : 'Slack Water'}
                </span>
              </div>
            </div>
          </div>

          {/* Estuary Drainage Status Box */}
          <div className={`p-3.5 sm:p-4 rounded-xl border space-y-1.5 ${backflowTheme.border}`}>
            <div className="text-xs font-bold uppercase tracking-wider">
              {backflowTheme.title}
            </div>
            <p className="text-[11px] sm:text-xs leading-relaxed opacity-90">
              {backflowTheme.desc}
            </p>
          </div>

          {/* Technical Datum Explainer Note for Users Comparing Online Sources */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/90 text-[11px] text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-300">Tidal Datum Calibration Note: </span>
            Online Philippine tide tables (NAMRIA, Tide-Forecast, PAGASA) reference{' '}
            <strong className="text-slate-200">Mean Lower Low Water (MLLW = 0.00m)</strong> as chart zero. Local Mean Sea Level (MSL) is calibrated at +0.72m above MLLW. All timestamps are synchronized to{' '}
            <strong className="text-cyan-300">Philippine Standard Time (PST · UTC+8)</strong>.
          </div>
        </div>

        {/* Right: Telemetry Visual Station (5 cols) */}
        <div className="lg:col-span-5 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative group">
          <img
            src="/images/river_floodgate_station.jpg"
            alt="Automated river floodgate and hydrologic telemetry station in Noveleta Cavite"
            className="w-full h-44 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Graceful fallback to styled visual container if external network blocks image
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-3 sm:p-4 flex flex-col justify-end pointer-events-none">
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-cyan-400">
              Coastal Station · Noveleta Rivermouth Sluice
            </div>
            <div className="text-xs sm:text-sm font-semibold text-white">
              Ylang-Ylang River Outfall & Floodgate Telemetry
            </div>
            <div className="text-[11px] sm:text-xs text-slate-300 mt-0.5 line-clamp-2">
              Automated sensors monitor hydraulic head between inland river discharge and incoming Manila Bay surge.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
