/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WeatherCurrent, HourlyForecastPoint } from '../types/weather';
import {
  Wind,
  Gauge,
  Compass,
  CloudRain,
  Sun,
  Cloud,
  CloudLightning,
  Droplets,
} from 'lucide-react';

interface WeatherWidgetProps {
  current: WeatherCurrent;
  hourly: HourlyForecastPoint[];
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ current, hourly }) => {
  const getCardinal = (deg: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round((deg % 360) / 22.5) % 16;
    return directions[idx];
  };

  const cardinal = getCardinal(current.windDirection);
  const isHabagatOnshore = current.windDirection >= 200 && current.windDirection <= 270;

  const getWeatherIcon = (code: number) => {
    if (code >= 95) return <CloudLightning className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400" />;
    if (code >= 50) return <CloudRain className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-400" />;
    if (code >= 1) return <Cloud className="w-7 h-7 sm:w-8 sm:h-8 text-slate-300" />;
    return <Sun className="w-7 h-7 sm:w-8 sm:h-8 text-amber-300" />;
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-6 space-y-5 sm:space-y-6">
      {/* Header & Location */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-400 mb-1">
            <span>Noveleta, Cavite</span>
            <span aria-hidden="true">·</span>
            <span>14.426°N, 120.878°E</span>
            <span aria-hidden="true">·</span>
            <span>1.5m MSL</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Current Atmospheric Conditions
          </h3>
        </div>
        <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/80 border border-slate-800 shrink-0">
          {getWeatherIcon(current.weatherCode)}
        </div>
      </div>

      {/* Primary Weather Reading */}
      <div className="flex flex-wrap items-baseline gap-4 sm:gap-6 pb-4 border-b border-slate-800/80">
        <div className="flex items-baseline gap-1.5 sm:gap-2">
          <span className="text-4xl sm:text-5xl font-bold font-mono tabular-nums text-white">
            {current.temperature}
          </span>
          <span className="text-lg sm:text-xl font-mono text-slate-400">°C</span>
        </div>

        <div className="space-y-0.5">
          <div className="text-xs sm:text-sm font-semibold text-slate-200">
            {current.weatherDescription}
          </div>
          <div className="text-[11px] sm:text-xs text-slate-400">
            Feels like <strong className="font-mono text-slate-200">{current.apparentTemperature}°C</strong>
          </div>
        </div>
      </div>

      {/* Grid of Key Telemetry Parameters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Precipitation Rate */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400">
            <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
            <span>Rain Rate</span>
          </div>
          <div className="text-base sm:text-lg font-bold font-mono text-white tabular-nums">
            {current.precipitation} <span className="text-[10px] sm:text-xs font-normal text-slate-400">mm/h</span>
          </div>
          <div className="text-[10px] sm:text-xs text-slate-400 font-mono truncate">
            {current.precipitation > 7.5 ? 'Heavy Downpour' : current.precipitation > 2.5 ? 'Moderate' : 'Trace / None'}
          </div>
        </div>

        {/* Wind Speed & Onshore Vector */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400">
            <Wind className="w-3.5 h-3.5 text-blue-400" />
            <span>Wind & Vector</span>
          </div>
          <div className="text-base sm:text-lg font-bold font-mono text-white tabular-nums">
            {current.windSpeed} <span className="text-[10px] sm:text-xs font-normal text-slate-400">km/h</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] sm:text-xs font-mono text-slate-400 truncate">
            <Compass className="w-3 h-3 text-cyan-400 shrink-0" />
            <span>{cardinal} ({current.windDirection}°)</span>
            {isHabagatOnshore && <span className="text-amber-400 font-semibold ml-0.5">· Onshore</span>}
          </div>
        </div>

        {/* Barometric Pressure */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400">
            <Gauge className="w-3.5 h-3.5 text-amber-400" />
            <span>Pressure</span>
          </div>
          <div className="text-base sm:text-lg font-bold font-mono text-white tabular-nums">
            {current.surfacePressure} <span className="text-[10px] sm:text-xs font-normal text-slate-400">hPa</span>
          </div>
          <div className="text-[10px] sm:text-xs font-mono text-slate-400 truncate">
            {current.surfacePressure < 1008 ? 'Depression' : 'Nominal Coastal'}
          </div>
        </div>

        {/* Relative Humidity */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400">
            <Droplets className="w-3.5 h-3.5 text-emerald-400" />
            <span>Humidity</span>
          </div>
          <div className="text-base sm:text-lg font-bold font-mono text-white tabular-nums">
            {current.humidity} <span className="text-[10px] sm:text-xs font-normal text-slate-400">%</span>
          </div>
          <div className="text-[10px] sm:text-xs font-mono text-slate-400 truncate">
            Gusts: {current.windGusts} km/h
          </div>
        </div>
      </div>

      {/* Immediate 6-Hour Rainfall Projection: Touch-friendly horizontal scroller on phones */}
      <div className="space-y-2 pt-1">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Immediate 6-Hour Rain Forecast</span>
            {hourly.length >= 6 && (
              <span className="px-1.5 py-0.5 rounded bg-slate-800/90 text-[10px] text-cyan-300 font-mono font-medium border border-slate-700/60">
                {hourly[0].formattedTime} – {hourly[5].formattedTime} PST
              </span>
            )}
          </div>
          <span className="hidden sm:inline text-slate-500">Rolling Philippine Standard Time (PST)</span>
        </div>
        <div className="flex sm:grid sm:grid-cols-6 gap-2 overflow-x-auto pb-1 scrollbar-none">
          {hourly.slice(0, 6).map((pt, i) => (
            <div
              key={i}
              className={`min-w-[78px] sm:min-w-0 flex-1 p-2 sm:p-2.5 rounded-lg border text-center space-y-1 shrink-0 ${
                i === 0
                  ? 'bg-cyan-950/30 border-cyan-700/60 ring-1 ring-cyan-500/20'
                  : 'bg-slate-950/50 border-slate-800/80'
              }`}
            >
              <div className="text-[10px] sm:text-xs font-mono text-slate-400 flex items-center justify-center gap-1">
                <span>{pt.formattedTime}</span>
                {i === 0 && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-900/80 text-cyan-200 font-semibold leading-tight">
                    NOW
                  </span>
                )}
              </div>
              <div className="text-xs sm:text-sm font-bold font-mono text-cyan-300 tabular-nums">
                {pt.precipitation} <span className="text-[10px] font-normal text-slate-400">mm</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-400 h-full rounded-full"
                  style={{ width: `${Math.min(100, Math.max(10, pt.precipitation * 15))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
