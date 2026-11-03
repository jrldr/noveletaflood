/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UplandWatershedData, SoilSaturationMetrics } from '../types/weather';
import { Mountain, Layers, Timer, Activity, Droplet } from 'lucide-react';

interface WatershedAndSoilPanelProps {
  watershed: UplandWatershedData;
  soil: SoilSaturationMetrics;
}

export const WatershedAndSoilPanel: React.FC<WatershedAndSoilPanelProps> = ({
  watershed,
  soil,
}) => {
  const getStatusColor = (status: UplandWatershedData['status']) => {
    switch (status) {
      case 'flash_flood_risk':
        return { text: 'text-rose-400', bg: 'bg-rose-950/40 border-rose-800/80', label: 'Flash Flood Risk' };
      case 'surging':
        return { text: 'text-orange-400', bg: 'bg-orange-950/40 border-orange-800/80', label: 'Surging Inflow' };
      case 'elevated':
        return { text: 'text-amber-400', bg: 'bg-amber-950/30 border-amber-800/60', label: 'Elevated' };
      case 'nominal':
      default:
        return { text: 'text-emerald-400', bg: 'bg-emerald-950/30 border-emerald-800/60', label: 'Nominal Baseflow' };
    }
  };

  const statusTheme = getStatusColor(watershed.status);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
      {/* 1. Upland Cavite Watershed Panel */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-400 mb-1">
              <span>Hydrologic Catchment</span>
              <span aria-hidden="true">·</span>
              <span>Ylang-Ylang & San Juan Basins</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Mountain className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Upland Watershed Telemetry</span>
            </h3>
          </div>
          <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold border shrink-0 ${statusTheme.bg} ${statusTheme.text}`}>
            {statusTheme.label}
          </div>
        </div>

        <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
          The headwaters of Noveleta’s river systems originate in the high volcanic slopes of Tagaytay Ridge and Silang (~480m elevation). Precipitation drains downhill through General Trias into Noveleta before reaching Manila Bay.
        </p>

        {/* Watershed Metric Grid */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
          <div className="p-3 sm:p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Upland Rain</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
              {watershed.currentRainRate} <span className="text-[10px] sm:text-xs font-normal text-slate-400">mm/h</span>
            </div>
            <div className="text-[10px] sm:text-xs text-slate-400 font-mono">
              6h Accum: {watershed.accumulatedRain6h} mm
            </div>
          </div>

          <div className="p-3 sm:p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Discharge Q</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-300 tabular-nums">
              {watershed.estimatedDischarge} <span className="text-[10px] sm:text-xs font-normal text-slate-400">m³/s</span>
            </div>
            <div className="text-[10px] sm:text-xs text-slate-400 font-mono">
              Baseflow: 25 m³/s
            </div>
          </div>
        </div>

        {/* Hydrologic Lag Arrival Time Banner */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-950/50 border border-amber-800/60 text-amber-400 shrink-0">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] sm:text-xs text-slate-400">Downstream Flow Transit Lag</div>
              <div className="text-xs sm:text-sm font-bold font-mono text-white">
                ~{watershed.transitLagHours} Hours Travel Delay
              </div>
            </div>
          </div>

          <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/80">
            <div className="text-[11px] sm:text-xs text-slate-400">Estimated Noveleta Arrival</div>
            <div className="text-xs sm:text-sm font-bold font-mono text-amber-300">
              {watershed.estimatedArrivalTime}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Regional Soil Saturation Markers Panel */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-400 mb-1">
              <span>Ground Hydrology</span>
              <span aria-hidden="true">·</span>
              <span>Alluvial Soil Model</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400 shrink-0" />
              <span>Regional Soil Saturation</span>
            </h3>
          </div>
          <div className="px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-mono font-semibold bg-slate-950 border border-slate-800 text-cyan-300 shrink-0">
            {soil.antecedentMoistureCondition}
          </div>
        </div>

        <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
          Soil saturation dictates whether heavy rain infiltrates harmlessly or generates instant flash runoff. Saturated soils (AMC-III) convert over 85% of rainfall into direct surface floodwater.
        </p>

        {/* Aggregate Saturation & Runoff Factor */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
          <div className="p-3 sm:p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="text-[11px] sm:text-xs text-slate-400">Total Saturation</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
              {soil.aggregateSaturationPercent}%
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  soil.aggregateSaturationPercent > 80
                    ? 'bg-rose-500'
                    : soil.aggregateSaturationPercent > 50
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${soil.aggregateSaturationPercent}%` }}
              />
            </div>
          </div>

          <div className="p-3 sm:p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="text-[11px] sm:text-xs text-slate-400">Runoff Coeff (C)</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-300 tabular-nums">
              {soil.runoffCoefficient}
            </div>
            <div className="text-[10px] sm:text-xs text-slate-400">
              {(soil.runoffCoefficient * 100).toFixed(0)}% flash runoff
            </div>
          </div>
        </div>

        {/* Multi-Depth Soil Moisture Breakdown */}
        <div className="space-y-2.5 pt-1">
          <div className="text-[10px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Multi-Horizon Soil Profile
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] sm:text-xs">
              <span className="text-slate-400">Topsoil (0 - 1 cm)</span>
              <span className="font-mono text-slate-200">{soil.topsoilMoisture}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${soil.topsoilMoisture}%` }} />
            </div>

            <div className="flex items-center justify-between text-[11px] sm:text-xs pt-0.5">
              <span className="text-slate-400">Subsoil (1 - 3 cm)</span>
              <span className="font-mono text-slate-200">{soil.midsoilMoisture}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${soil.midsoilMoisture}%` }} />
            </div>

            <div className="flex items-center justify-between text-[11px] sm:text-xs pt-0.5">
              <span className="text-slate-400">Vadose Zone (3 - 9 cm)</span>
              <span className="font-mono text-slate-200">{soil.deepsoilMoisture}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-600 h-full rounded-full" style={{ width: `${soil.deepsoilMoisture}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
