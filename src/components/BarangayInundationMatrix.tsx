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
              {/* Manila Bay / Bacoor Bay (North / Top boundary) */}
              <path
                d="M 0,0 L 400,0 L 400,90 Q 250,70 150,85 T 0,75 Z"
                fill="#0f2b48"
                opacity="0.75"
              />
              <text x="16" y="24" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                MANILA BAY / BACOOR BAY (NORTH)
              </text>
              <text x="16" y="38" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                ← Coastal Surge & Tidal Outfall
              </text>

              {/* Neighboring Boundaries Labels */}
              <text x="310" y="140" fill="#64748b" fontSize="7.5" fontFamily="monospace">
                (TO KAWIT / EAST)
              </text>
              <text x="20" y="280" fill="#64748b" fontSize="7.5" fontFamily="monospace">
                (TO ROSARIO / WEST)
              </text>
              <text x="310" y="285" fill="#64748b" fontSize="7.5" fontFamily="monospace">
                (TO GEN. TRIAS / SOUTH)
              </text>

              {/* Ylang-Ylang & San Juan River Delta Channel flowing from SE upland to NW bay outfall */}
              <path
                d="M 350,280 Q 280,220 220,180 T 130,110 L 110,80"
                fill="none"
                stroke="#0284c7"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
              />
              <path
                d="M 350,280 Q 280,220 220,180 T 130,110 L 110,80"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeDasharray="5 3"
              />
              <text x="240" y="240" fill="#38bdf8" fontSize="8" fontFamily="monospace">
                Ylang-Ylang River Basin →
              </text>

              {/* Floodgate outfall marker at estuary */}
              <circle cx="110" cy="80" r="6" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
              <text x="122" y="83" fill="#ffffff" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
                Floodgates
              </text>

              {/* Geographically accurate Barangay Node Markers */}
              {barangays.map((b, i) => {
                const pos = [
                  { x: 125, y: 110 }, // San Rafael I (Riverine upstream from estuary)
                  { x: 145, y: 125 }, // San Rafael II
                  { x: 170, y: 145 }, // San Rafael III
                  { x: 155, y: 165 }, // San Rafael IV
                  { x: 70,  y: 85  }, // Santa Rosa I (Coastal)
                  { x: 55,  y: 110 }, // Santa Rosa II (Coastal)
                  { x: 195, y: 190 }, // Poblacion (Town Center)
                  { x: 80,  y: 145 }, // San Antonio I (Coastal/Estuary)
                  { x: 65,  y: 175 }, // San Antonio II (Coastal/Estuary)
                  { x: 230, y: 170 }, // San Juan I (Riverine)
                  { x: 265, y: 195 }, // San Juan II (Riverine)
                  { x: 215, y: 225 }, // Magdiwang (Inland Lowland)
                  { x: 145, y: 235 }, // Salcedo I (Inland Lowland)
                  { x: 175, y: 255 }, // Salcedo II (Inland Lowland)
                  { x: 280, y: 235 }, // San Jose I (Slight Upland South)
                  { x: 320, y: 250 }, // San Jose II (Slight Upland South)
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
                    {/* Expanded touch target */}
                    <circle cx={pos.x} cy={pos.y} r="20" fill="transparent" />

                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isSelected ? 10 : 7.5}
                      fill={nodeColor}
                      stroke={isSelected ? '#ffffff' : '#0f172a'}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      opacity={isSelected ? 1 : 0.9}
                    />
                    <text
                      x={pos.x}
                      y={pos.y - 10}
                      textAnchor="middle"
                      fill={isSelected ? '#ffffff' : '#cbd5e1'}
                      fontSize="7.5"
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
