/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SimulationParams } from '../types/weather';
import { X, SlidersHorizontal, RotateCcw, Play } from 'lucide-react';

interface ScenarioSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  simulation: SimulationParams;
  onUpdateSimulation: (sim: SimulationParams) => void;
  onResetToLive: () => void;
}

export const ScenarioSimulatorModal: React.FC<ScenarioSimulatorModalProps> = ({
  isOpen,
  onClose,
  simulation,
  onUpdateSimulation,
  onResetToLive,
}) => {
  if (!isOpen) return null;

  const presets = [
    {
      name: 'STS Paeng (2022) Deluge Replay',
      description: 'Record 218mm precipitation + 96% saturated soil + extreme 1.78m Manila Bay tide.',
      params: {
        enabled: true,
        name: 'STS Paeng (2022)',
        rainfallMultiplier: 4.8,
        uplandRainfallMm: 284,
        soilSaturationAdjustment: 35,
        tideSurgeOffsetMeters: 0.85,
        windSpeedKmh: 68,
        windDirectionDegrees: 240,
      },
    },
    {
      name: 'Typhoon Carina (2024) + Monsoon Surge',
      description: 'Heavy Habagat monsoon rains combined with onshore coastal surge pushing into Bacoor Bay.',
      params: {
        enabled: true,
        name: 'Typhoon Carina (2024)',
        rainfallMultiplier: 3.5,
        uplandRainfallMm: 220,
        soilSaturationAdjustment: 28,
        tideSurgeOffsetMeters: 0.65,
        windSpeedKmh: 55,
        windDirectionDegrees: 250,
      },
    },
    {
      name: 'King Tide Peak + Choked Estuary',
      description: 'Spring astronomical tide + surge blocks Ylang-Ylang river drainage, causing backflow.',
      params: {
        enabled: true,
        name: 'King Tide Choke',
        rainfallMultiplier: 2.0,
        uplandRainfallMm: 110,
        soilSaturationAdjustment: 15,
        tideSurgeOffsetMeters: 0.95,
        windSpeedKmh: 42,
        windDirectionDegrees: 245,
      },
    },
    {
      name: 'Upland Tagaytay Flash Cloudburst',
      description: 'Dry Noveleta coast but violent cloudburst on Tagaytay ridge headwaters arriving via 3.2h lag.',
      params: {
        enabled: true,
        name: 'Upland Flash Pulse',
        rainfallMultiplier: 1.0,
        uplandRainfallMm: 195,
        soilSaturationAdjustment: 10,
        tideSurgeOffsetMeters: 0.2,
        windSpeedKmh: 20,
        windDirectionDegrees: 180,
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 shadow-2xl pb-safe">
        {/* Mobile Drag Handle Affordance (§3 Pattern 3) */}
        <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-1 sm:hidden" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-400 mb-1">
              <span>Hydrologic Stress Test</span>
              <span aria-hidden="true">·</span>
              <span>What-If Simulator</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Hydrologic Scenario Simulator</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors shrink-0"
            aria-label="Close Simulator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
          Test how Noveleta’s flood risk, line graph prognosis, and barangay inundation change under catastrophic weather, king tides, or upland cloudbursts.
        </p>

        {/* Quick Presets */}
        <div className="space-y-2">
          <div className="text-[10px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Disaster Presets & Historical Replays
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => onUpdateSimulation(preset.params)}
                className={`min-h-[48px] p-3 sm:p-3.5 rounded-xl border text-left transition-all space-y-1 active:scale-[0.99] ${
                  simulation.enabled && simulation.name === preset.params.name
                    ? 'bg-amber-950/40 border-amber-500/70 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className="text-xs font-bold flex items-center justify-between gap-1">
                  <span>{preset.name}</span>
                  <Play className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                </div>
                <div className="text-[11px] text-slate-400 leading-snug">
                  {preset.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Sliders: Touch-friendly */}
        <div className="space-y-4 pt-2 border-t border-slate-800">
          <div className="text-[10px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Custom Parameter Tuning
          </div>

          {/* Rainfall Multiplier Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Precipitation Multiplier</span>
              <span className="font-mono text-cyan-300 font-bold tabular-nums">
                {simulation.rainfallMultiplier.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="6.0"
              step="0.1"
              value={simulation.rainfallMultiplier}
              onChange={(e) =>
                onUpdateSimulation({
                  ...simulation,
                  enabled: true,
                  name: 'Custom Tuned',
                  rainfallMultiplier: parseFloat(e.target.value),
                })
              }
              className="w-full h-2 rounded-lg accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Upland Catchment Rainfall Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Upland Catchment Rain (Tagaytay)</span>
              <span className="font-mono text-amber-300 font-bold tabular-nums">
                {simulation.uplandRainfallMm} mm
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="300"
              step="5"
              value={simulation.uplandRainfallMm}
              onChange={(e) =>
                onUpdateSimulation({
                  ...simulation,
                  enabled: true,
                  name: 'Custom Tuned',
                  uplandRainfallMm: parseInt(e.target.value, 10),
                })
              }
              className="w-full h-2 rounded-lg accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Soil Saturation Adjustment Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Soil Saturation Delta</span>
              <span className="font-mono text-cyan-300 font-bold tabular-nums">
                {simulation.soilSaturationAdjustment >= 0 ? '+' : ''}
                {simulation.soilSaturationAdjustment}%
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="40"
              step="2"
              value={simulation.soilSaturationAdjustment}
              onChange={(e) =>
                onUpdateSimulation({
                  ...simulation,
                  enabled: true,
                  name: 'Custom Tuned',
                  soilSaturationAdjustment: parseInt(e.target.value, 10),
                })
              }
              className="w-full h-2 rounded-lg accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Tide Surge Offset Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Coastal Surge Offset</span>
              <span className="font-mono text-blue-300 font-bold tabular-nums">
                {simulation.tideSurgeOffsetMeters >= 0 ? '+' : ''}
                {simulation.tideSurgeOffsetMeters.toFixed(2)} m
              </span>
            </div>
            <input
              type="range"
              min="-0.4"
              max="1.5"
              step="0.05"
              value={simulation.tideSurgeOffsetMeters}
              onChange={(e) =>
                onUpdateSimulation({
                  ...simulation,
                  enabled: true,
                  name: 'Custom Tuned',
                  tideSurgeOffsetMeters: parseFloat(e.target.value),
                })
              }
              className="w-full h-2 rounded-lg accent-blue-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Action Buttons with touch targets >= 44px */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              onResetToLive();
              onClose();
            }}
            className="min-h-[44px] px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Live Real-Time</span>
          </button>

          <button
            onClick={onClose}
            className="min-h-[44px] px-5 py-2.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 rounded-xl transition-colors flex items-center justify-center active:scale-[0.98]"
          >
            Apply Scenario & Close
          </button>
        </div>
      </div>
    </div>
  );
};
