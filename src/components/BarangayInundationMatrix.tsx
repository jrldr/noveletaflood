/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BarangayFloodStatus, FloodRiskLevel } from '../types/weather';
import { MapPin, Search, ShieldAlert, Waves, Mountain, Building2, Users } from 'lucide-react';

interface BarangayInundationMatrixProps {
  barangays: BarangayFloodStatus[];
}

export const BarangayInundationMatrix: React.FC<BarangayInundationMatrixProps> = ({ barangays }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedBarangay, setSelectedBarangay] = useState<BarangayFloodStatus | null>(barangays[0] || null);

  const filteredBarangays = barangays.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = selectedZone === 'all' || b.zone === selectedZone;
    return matchesSearch && matchesZone;
  });

  const getRiskBadge = (level: FloodRiskLevel) => {
    switch (level) {
      case 'critical':
        return { text: 'text-rose-400 bg-rose-950/60 border-rose-800/80', label: 'Critical Risk' };
      case 'high':
        return { text: 'text-orange-400 bg-orange-950/60 border-orange-800/80', label: 'High Threat' };
      case 'moderate':
        return { text: 'text-amber-400 bg-amber-950/50 border-amber-800/70', label: 'Moderate Advisory' };
      case 'low':
      case 'minimal':
      default:
        return { text: 'text-emerald-400 bg-emerald-950/50 border-emerald-800/70', label: 'Nominal / Low' };
    }
  };

  const activeBrgy = selectedBarangay || filteredBarangays[0] || barangays[0];
  const activeBadge = getRiskBadge(activeBrgy.riskLevel);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-6 md:p-8 space-y-6">
      {/* Title & Search / Filter Controls */}
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-400 mb-1">
            <span>Granular Community Telemetry</span>
            <span aria-hidden="true">·</span>
            <span>Municipality of Noveleta, Cavite</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>Barangay Inundation & Vulnerability Matrix</span>
          </h3>
        </div>

        {/* Search & Zone Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search barangay by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full min-h-[44px] pl-10 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setSelectedZone('all')}
              className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedZone === 'all' ? 'bg-slate-800 text-white shadow-sm font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All (16)
            </button>
            <button
              onClick={() => setSelectedZone('Riverine (Ylang-Ylang)')}
              className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedZone === 'Riverine (Ylang-Ylang)' ? 'bg-slate-800 text-cyan-300 shadow-sm font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Riverine
            </button>
            <button
              onClick={() => setSelectedZone('Coastal / Estuary')}
              className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedZone === 'Coastal / Estuary' ? 'bg-slate-800 text-blue-300 shadow-sm font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Coastal
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Granular Inspector Card + Full 16-Barangay Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Detailed Active Barangay Inspector Card (5 cols) */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-5">
          <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-0.5">
                {activeBrgy.zone}
              </div>
              <h4 className="text-xl font-bold text-white">{activeBrgy.name}</h4>
            </div>
            <span className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-semibold ${activeBadge.text}`}>
              {activeBadge.label}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400">Predicted Depth</div>
              <div className="text-xl font-bold font-mono text-rose-400">
                {activeBrgy.predictedWaterDepthMeters}m
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400">Risk Score</div>
              <div className="text-xl font-bold font-mono text-white">
                {activeBrgy.riskScore}%
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Mountain className="w-3.5 h-3.5 text-cyan-400" />
                <span>Elevation / Datum:</span>
              </span>
              <strong className="font-mono text-white">{activeBrgy.elevationMeters}m MSL</strong>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <span className="text-slate-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Primary Threat:</span>
              </span>
              <strong className="text-white">{activeBrgy.primaryThreat}</strong>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>Population Est:</span>
              </span>
              <strong className="font-mono text-white">{activeBrgy.populationEstimate.toLocaleString()} residents</strong>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Designated Evacuation Center:</span>
              </span>
              <div className="text-xs font-semibold text-white pl-5">
                {activeBrgy.evacuationCenter}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Full Table of All 16 Barangays (7 cols) */}
        <div className="lg:col-span-7 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80">
          <table className="w-full text-left text-xs min-w-[340px]">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono">
              <tr>
                <th className="py-3 px-3.5">Barangay & Zone</th>
                <th className="py-3 px-3 text-right">Elev</th>
                <th className="py-3 px-3 text-right">Depth</th>
                <th className="py-3 px-3.5 text-right">Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredBarangays.map((b) => {
                const badge = getRiskBadge(b.riskLevel);
                const isSelected = activeBrgy.id === b.id;

                return (
                  <tr
                    key={b.id}
                    onClick={() => setSelectedBarangay(b)}
                    className={`cursor-pointer transition-colors min-h-[48px] ${
                      isSelected
                        ? 'bg-slate-800/90'
                        : 'hover:bg-slate-900/60 active:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3 px-3.5 font-medium text-white">
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{b.name}</span>
                        <span className="text-[11px] text-slate-400">{b.primaryThreat}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">
                      {b.elevationMeters.toFixed(1)}m
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">
                      {b.predictedWaterDepthMeters > 0 ? (
                        <span className="text-rose-400">{b.predictedWaterDepthMeters}m</span>
                      ) : (
                        <span className="text-slate-500">0.0m</span>
                      )}
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono font-bold tabular-nums">
                      <span className={`px-2 py-1 rounded-md border text-xs ${badge.text}`}>
                        {b.riskScore}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
