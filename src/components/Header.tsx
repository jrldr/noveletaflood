/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RefreshCw, SlidersHorizontal, ShieldAlert, LineChart, Mountain, Waves, MapPin } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  onOpenSimulator: () => void;
  isSimulating: boolean;
  simulationName?: string;
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onRefresh,
  isLoading,
  onOpenSimulator,
  isSimulating,
  simulationName,
  activeSection,
  onSelectSection,
}) => {
  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/90">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 sm:gap-8 h-14 sm:h-16">
            {/* Zone 1: Wordmark Brand */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelectSection('overview');
              }}
              className="flex items-center gap-2 text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-cyan-400 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span className="truncate max-w-[170px] sm:max-w-none">Noveleta FloodWatch</span>
            </a>

            {/* Zone 2: 4-5 Desktop Nav Links (Hidden on mobile, mobile uses Bottom Bar) */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
              <button
                onClick={() => onSelectSection('overview')}
                className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-2 ${
                  activeSection === 'overview' ? 'text-cyan-400 font-semibold' : ''
                }`}
              >
                Current Risk
              </button>
              <button
                onClick={() => onSelectSection('forecast')}
                className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-2 ${
                  activeSection === 'forecast' ? 'text-cyan-400 font-semibold' : ''
                }`}
              >
                24-Hour Forecast
              </button>
              <button
                onClick={() => onSelectSection('watershed')}
                className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-2 ${
                  activeSection === 'watershed' ? 'text-cyan-400 font-semibold' : ''
                }`}
              >
                Watershed & Soil
              </button>
              <button
                onClick={() => onSelectSection('tides')}
                className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-2 ${
                  activeSection === 'tides' ? 'text-cyan-400 font-semibold' : ''
                }`}
              >
                Tides & Surge
              </button>
              <button
                onClick={() => onSelectSection('historical')}
                className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-2 ${
                  activeSection === 'historical' ? 'text-cyan-400 font-semibold' : ''
                }`}
              >
                Historical Analysis
              </button>
              <button
                onClick={() => onSelectSection('barangays')}
                className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-2 ${
                  activeSection === 'barangays' ? 'text-cyan-400 font-semibold' : ''
                }`}
              >
                Barangay Matrix
              </button>
            </nav>

            {/* Zone 3: Actions (Mobile touch target >= 44px) */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              <PWAInstallButton variant="header" />

              <button
                onClick={onOpenSimulator}
                className={`min-h-[44px] min-w-[44px] px-2.5 sm:px-3 py-2 text-xs font-medium rounded-lg border transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isSimulating
                    ? 'bg-amber-950/70 border-amber-500/70 text-amber-200 hover:bg-amber-900/60'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title="Open Hydrologic Scenario Simulator"
                aria-label="Simulate What-If Scenarios"
              >
                <SlidersHorizontal className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="hidden sm:inline">
                  {isSimulating ? `Scenario: ${simulationName || 'Active'}` : 'Simulate What-If'}
                </span>
                {isSimulating && <span className="sm:hidden text-[10px] font-bold text-amber-300">Sim</span>}
              </button>

              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="min-h-[44px] min-w-[44px] px-3 sm:px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 rounded-lg hover:bg-cyan-300 active:bg-cyan-500 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 disabled:opacity-50"
                aria-label="Sync Live Feed"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Sync Live</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Fixed Bottom Tab Bar for Smartphones (Thumb zone navigation) */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 md:hidden pb-safe"
      >
        <div className="grid grid-cols-5 items-center h-14">
          <button
            onClick={() => onSelectSection('overview')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              activeSection === 'overview' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span className="text-[10px] tracking-tight mt-0.5">Risk</span>
          </button>

          <button
            onClick={() => onSelectSection('forecast')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              activeSection === 'forecast' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LineChart className="w-5 h-5 shrink-0" />
            <span className="text-[10px] tracking-tight mt-0.5">Forecast</span>
          </button>

          <button
            onClick={() => onSelectSection('watershed')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              activeSection === 'watershed' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mountain className="w-5 h-5 shrink-0" />
            <span className="text-[10px] tracking-tight mt-0.5">Watershed</span>
          </button>

          <button
            onClick={() => onSelectSection('tides')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              activeSection === 'tides' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Waves className="w-5 h-5 shrink-0" />
            <span className="text-[10px] tracking-tight mt-0.5">Tides</span>
          </button>

          <button
            onClick={() => onSelectSection('barangays')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              activeSection === 'barangays' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-5 h-5 shrink-0" />
            <span className="text-[10px] tracking-tight mt-0.5">Barangays</span>
          </button>
        </div>
      </nav>
    </>
  );
};
