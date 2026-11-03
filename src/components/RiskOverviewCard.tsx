/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, Waves, CloudRain, Droplets, Mountain, ArrowUpRight } from 'lucide-react';
import { CompoundFloodRisk, FloodRiskLevel } from '../types/weather';

interface RiskOverviewCardProps {
  compoundRisk: CompoundFloodRisk;
  onViewForecast: () => void;
  onViewBarangays: () => void;
}

export const RiskOverviewCard: React.FC<RiskOverviewCardProps> = ({
  compoundRisk,
  onViewForecast,
  onViewBarangays,
}) => {
  const {
    overallScore,
    riskLevel,
    primaryRiskDrivers,
    estuaryChokeFactor,
    peakRiskTime,
    peakRiskScore,
    historicalSeverityEquivalent,
    evacuationRecommended,
    actionGuidance,
  } = compoundRisk;

  const getRiskTheme = (level: FloodRiskLevel) => {
    switch (level) {
      case 'critical':
        return {
          label: 'CRITICAL EVACUATION ALERT',
          badgeText: 'Level 4 / Extreme Risk',
          textColor: 'text-rose-400',
          accentBg: 'bg-rose-950/40 border-rose-800/80',
          progressColor: 'bg-rose-500',
          bannerColor: 'bg-rose-950/70 border-rose-700/80 text-rose-200',
          indicatorGlyph: '✖ Critical',
        };
      case 'high':
        return {
          label: 'HIGH FLOOD WARNING',
          badgeText: 'Level 3 / High Threat',
          textColor: 'text-orange-400',
          accentBg: 'bg-orange-950/40 border-orange-800/80',
          progressColor: 'bg-orange-500',
          bannerColor: 'bg-orange-950/60 border-orange-700/80 text-orange-200',
          indicatorGlyph: '▲ High Warning',
        };
      case 'moderate':
        return {
          label: 'MODERATE FLOOD ADVISORY',
          badgeText: 'Level 2 / Guard State',
          textColor: 'text-amber-400',
          accentBg: 'bg-amber-950/30 border-amber-800/60',
          progressColor: 'bg-amber-500',
          bannerColor: 'bg-amber-950/50 border-amber-800/70 text-amber-200',
          indicatorGlyph: '▲ Advisory',
        };
      case 'low':
      case 'minimal':
      default:
        return {
          label: 'CONDITIONS NOMINAL / LOW RISK',
          badgeText: 'Level 1 / Normal Runoff',
          textColor: 'text-emerald-400',
          accentBg: 'bg-emerald-950/30 border-emerald-800/60',
          progressColor: 'bg-emerald-500',
          bannerColor: 'bg-emerald-950/40 border-emerald-800/70 text-emerald-200',
          indicatorGlyph: '● Nominal',
        };
    }
  };

  const theme = getRiskTheme(riskLevel);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
      {/* Top Banner if High or Critical */}
      {evacuationRecommended && (
        <div className={`p-3.5 sm:p-4 rounded-xl border flex items-start gap-3 ${theme.bannerColor}`}>
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
          <div className="space-y-1 text-xs sm:text-sm">
            <div className="font-bold tracking-tight">Preemptive Evacuation Advisory Triggered</div>
            <div className="text-[11px] sm:text-xs leading-relaxed opacity-90">
              Low-lying barangays along the Ylang-Ylang river and Manila Bay coastline (San Rafael I-IV, Santa Rosa I-II) are at risk of severe inundation due to compound runoff and tide choking.
            </div>
          </div>
        </div>
      )}

      {/* Main Score Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left: Overall Risk Score Meter */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-slate-400">
            <span>Noveleta Basin Compound Flood Risk</span>
            <span aria-hidden="true">·</span>
            <span>Estuary + Watershed Model</span>
          </div>

          <div className="flex items-baseline gap-3 sm:gap-4">
            <span className={`text-5xl sm:text-7xl font-bold font-mono tabular-nums tracking-tight ${theme.textColor}`}>
              {overallScore}
            </span>
            <div className="space-y-0.5 sm:space-y-1">
              <span className="text-lg sm:text-xl font-mono text-slate-400">/ 100</span>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                {theme.indicatorGlyph}
              </div>
            </div>
          </div>

          {/* Risk Level Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${theme.progressColor}`}
                style={{ width: `${Math.max(5, overallScore)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] sm:text-xs font-mono text-slate-400">
              <span>0 Min</span>
              <span>25 Mod</span>
              <span>50 High</span>
              <span>75 Crit</span>
            </div>
          </div>

          {/* Qualitative summary text */}
          <div className="pt-2 border-t border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              Current conditions indicate <strong className="text-white">{theme.label.toLowerCase()}</strong>. {historicalSeverityEquivalent}.
            </p>
          </div>

          {/* Estuary Choke Alert */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Estuary Drainage Choke Factor</span>
              <span className="font-mono font-bold text-cyan-400 tabular-nums">
                {estuaryChokeFactor}x Multiplier
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 leading-normal">
              {estuaryChokeFactor > 1.2
                ? 'High coastal water elevation is restricting gravity outflow from the Ylang-Ylang river outfall into Manila Bay, magnifying flood retention.'
                : 'River outfall is discharging freely into Manila Bay with minimal backwater resistance.'}
            </p>
          </div>

          {/* Action CTAs: touch target >= 44px on mobile */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
            <button
              onClick={onViewForecast}
              className="min-h-[44px] px-4 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-[0.98]"
            >
              <span>View 24h Risk Line Graph</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onViewBarangays}
              className="min-h-[44px] px-4 py-2.5 text-xs font-semibold text-cyan-300 hover:text-cyan-200 bg-slate-950/60 sm:bg-transparent border border-slate-800 sm:border-0 rounded-xl sm:rounded-none transition-colors flex items-center justify-center whitespace-nowrap active:scale-[0.98]"
            >
              Inspect 16 Barangays →
            </button>
          </div>
        </div>

        {/* Right: 4 Contributing Risk Drivers */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h3 className="text-sm font-semibold text-white">Compound Hydro-Risk Drivers</h3>
            <span className="text-xs text-slate-400">
              Peak: <strong className="text-white font-mono">{peakRiskScore}%</strong> at <strong className="text-white font-mono">{peakRiskTime}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
            {primaryRiskDrivers.map((driver) => {
              let Icon = Droplets;
              if (driver.name.includes('Watershed')) Icon = Mountain;
              if (driver.name.includes('Local')) Icon = CloudRain;
              if (driver.name.includes('Tide')) Icon = Waves;

              const isSevere = driver.severity === 'severe';
              const isElevated = driver.severity === 'elevated';

              return (
                <div
                  key={driver.name}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                    isSevere
                      ? 'bg-rose-950/20 border-rose-800/60'
                      : isElevated
                      ? 'bg-amber-950/20 border-amber-800/50'
                      : 'bg-slate-950/60 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-800/80 text-cyan-400 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium text-slate-200">{driver.name}</span>
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-400 tabular-nums">
                      {driver.contributionPercent}%
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm font-mono font-bold text-white tabular-nums mb-1.5">
                    {driver.valueLabel}
                  </div>

                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isSevere ? 'bg-rose-500' : isElevated ? 'bg-amber-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${Math.max(10, driver.contributionPercent * 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Guidance Accordion / Box */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="text-[11px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Hydrologic Action Guidance
            </div>
            <ul className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs text-slate-300 leading-relaxed">
              {actionGuidance.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-mono font-bold shrink-0">0{idx + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
