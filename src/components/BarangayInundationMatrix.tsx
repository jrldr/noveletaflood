/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BarangayFloodStatus, FloodRiskLevel } from '../types/weather';
import { MapPin, Search, ChevronRight } from 'lucide-react';

interface BarangayInundationMatrixProps {
  barangays: BarangayFloodStatus[];
}

export const BarangayInundationMatrix: React.FC<BarangayInundationMatrixProps> = ({ barangays }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedBarangay, setSelectedBarangay] = useState<BarangayFloodStatus | null>(null);

  const filteredBarangays = barangays.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = selectedZone === 'all' || b.zone === selectedZone;
    return matchesSearch && matchesZone;
  });

  const getRiskBadge = (level: FloodRiskLevel) => {
    switch (level) {
      case 'critical':
        return { text: 'text-rose-400', label: 'Critical' };
      case 'high':
        return { text: 'text-orange-400', label: 'High' };
      case 'moderate':
        return { text: 'text-amber-400', label: 'Moderate' };
      case 'low':
      case 'minimal':
      default:
        return { text: 'text-emerald-400', label: 'Low' };
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col gap-3">
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

        {/* Filter & Search Bar: Fully responsive and touch-friendly */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search barangay..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full min-h-[44px] pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
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

      {/* Interactive Basin Schematic Visual + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Schematic SVG Map of Noveleta Basin (5 cols) */}
        <div className="lg:col-span-5 p-3.5 sm:p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Hydro-Geographic Map</span>
            <span className="text-[11px]">Tap node to inspect</span>
          </div>

          <div className="relative aspect-[4/3] w-full bg-slate-900/60 rounded-lg border border-slate-800/80 overflow-hidden flex items-center justify-center select-none">
            <svg viewBox="0 0 400 300" className="w-full h-full touch-manipulation">
              {/* Manila Bay / Coastline */}
              <path
                d="M 0,0 L 400,0 L 400,80 Q 280,70 200,90 T 50,110 L 0,110 Z"
                fill="#0f2b48"
                opacity="0.6"
              />
              <text x="16" y="32" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                MANILA BAY / BACOOR BAY
              </text>
              <text x="16" y="48" fill="#94a3b8" fontSize="8.5" fontFamily="monospace">
                Coastal Surge Vector →
              </text>

              {/* Ylang-Ylang River Channel */}
              <path
                d="M 360,300 Q 310,240 260,220 T 200,160 Q 150,120 120,95 L 110,85"
                fill="none"
                stroke="#0284c7"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.85"
              />
              <path
                d="M 360,300 Q 310,240 260,220 T 200,160 Q 150,120 120,95 L 110,85"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeDasharray="6 4"
              />
              <text x="210" y="280" fill="#38bdf8" fontSize="8.5" fontFamily="monospace">
                ← Upland Inflow (from Tagaytay/Silang)
              </text>

              {/* Floodgate outfall marker */}
              <circle cx="110" cy="85" r="7" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
              <text x="122" y="88" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="bold">
                Floodgates
              </text>

              {/* Barangay Node Markers with enlarged touch targets */}
              {barangays.map((b, i) => {
                const pos = [
                  { x: 105, y: 130 }, // San Rafael I
                  { x: 145, y: 140 }, // San Rafael II
                  { x: 180, y: 165 }, // San Rafael III
                  { x: 155, y: 185 }, // San Rafael IV
                  { x: 65, y: 125 },  // Santa Rosa I
                  { x: 50, y: 155 },  // Santa Rosa II
                  { x: 140, y: 220 }, // Poblacion
                  { x: 80, y: 195 },  // San Antonio I
                  { x: 60, y: 225 },  // San Antonio II
                  { x: 230, y: 200 }, // San Juan I
                  { x: 260, y: 225 }, // San Juan II
                  { x: 195, y: 250 }, // Magdiwang
                  { x: 130, y: 265 }, // Salcedo I
                  { x: 165, y: 275 }, // Salcedo II
                  { x: 290, y: 255 }, // San Jose I
                  { x: 330, y: 265 }, // San Jose II
                ][i] || { x: 200, y: 200 };

                const isSelected = selectedBarangay?.id === b.id;
                const isCritical = b.riskLevel === 'critical';
                const isHigh = b.riskLevel === 'high';
                const isMod = b.riskLevel === 'moderate';

                const nodeColor = isCritical
                  ? '#f43f5e'
                  : isHigh
                  ? '#f97316'
                  : isMod
                  ? '#f59e0b'
                  : '#10b981';

                return (
                  <g
                    key={b.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedBarangay(b)}
                  >
                    {/* Invisible expanded touch hitbox (40px) */}
                    <circle cx={pos.x} cy={pos.y} r="20" fill="transparent" />

                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isSelected ? 11 : 8}
                      fill={nodeColor}
                      stroke={isSelected ? '#ffffff' : '#0f172a'}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      opacity={isSelected ? 1 : 0.9}
                    />
                    <text
                      x={pos.x}
                      y={pos.y - 11}
                      textAnchor="middle"
                      fill={isSelected ? '#ffffff' : '#cbd5e1'}
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                    >
                      {b.name.replace(/Barangay|I|II|III|IV|\(Town Center\)/gi, '').trim()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Selected Barangay Quick Inspector */}
          {selectedBarangay ? (
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{selectedBarangay.name}</span>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  Risk: {selectedBarangay.riskScore}%
                </span>
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <div>Elevation: <strong className="text-white font-mono">{selectedBarangay.elevationMeters}m MSL</strong> · Threat: <strong className="text-white">{selectedBarangay.primaryThreat}</strong></div>
                <div>Predicted Water Depth: <strong className="text-rose-400 font-mono">{selectedBarangay.predictedWaterDepthMeters}m</strong></div>
                <div>Evacuation Site: <strong className="text-white">{selectedBarangay.evacuationCenter}</strong></div>
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 text-center py-1">
              Tap any map node or table row below to inspect community vulnerability.
            </div>
          )}
        </div>

        {/* Granular Table of All 16 Barangays (7 cols) */}
        <div className="lg:col-span-7 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-left text-xs min-w-[340px]">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono">
              <tr>
                <th className="py-3 px-3 sm:px-3.5">Barangay</th>
                <th className="py-3 px-2 sm:px-3 text-right">Elev</th>
                <th className="py-3 px-2 sm:px-3 text-right">Est. Depth</th>
                <th className="py-3 px-3 sm:px-3.5 text-right">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredBarangays.map((b) => {
                const badge = getRiskBadge(b.riskLevel);
                const isSelected = selectedBarangay?.id === b.id;

                return (
                  <tr
                    key={b.id}
                    onClick={() => setSelectedBarangay(b)}
                    className={`cursor-pointer transition-colors min-h-[48px] ${
                      isSelected
                        ? 'bg-slate-800/80'
                        : 'hover:bg-slate-900/50 active:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3 px-3 sm:px-3.5 font-medium text-white">
                      <div className="flex flex-col">
                        <span className="font-semibold">{b.name}</span>
                        <span className="text-[11px] text-slate-400">{b.primaryThreat}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-right font-mono tabular-nums text-slate-300">
                      {b.elevationMeters.toFixed(1)}m
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-right font-mono font-bold tabular-nums">
                      {b.predictedWaterDepthMeters > 0 ? (
                        <span className="text-rose-400">{b.predictedWaterDepthMeters}m</span>
                      ) : (
                        <span className="text-slate-500">0.0m</span>
                      )}
                    </td>
                    <td className="py-3 px-3 sm:px-3.5 text-right font-mono font-bold tabular-nums">
                      <span className={badge.text}>
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
