/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { RiskOverviewCard } from './components/RiskOverviewCard';
import { RiskForecastChart } from './components/RiskForecastChart';
import { WeatherWidget } from './components/WeatherWidget';
import { WatershedAndSoilPanel } from './components/WatershedAndSoilPanel';
import { CoastalTidePanel } from './components/CoastalTidePanel';
import { HistoricalComparisonPanel } from './components/HistoricalComparisonPanel';
import { BarangayInundationMatrix } from './components/BarangayInundationMatrix';
import { ScenarioSimulatorModal } from './components/ScenarioSimulatorModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { fetchLiveWeatherData, formatPhilippineTime } from './services/weatherService';
import heroBasinImg from './assets/images/noveleta_coastal_basin_1793465582841.jpg';
import {
  WeatherCurrent,
  HourlyForecastPoint,
  UplandWatershedData,
  SoilSaturationMetrics,
  TideSurgeData,
  CompoundFloodRisk,
  HistoricalBenchmark,
  BarangayFloodStatus,
  SimulationParams,
} from './types/weather';
import { RefreshCw, AlertTriangle, Eye, EyeOff, Radio } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [activeSection, setActiveSection] = useState<string>('overview');

  // Hero Background Visual Mode: 'satellite' vs 'topographic'
  const [heroMode, setHeroMode] = useState<'satellite' | 'topographic'>('satellite');
  const [imageError, setImageError] = useState(false);

  // Simulation State
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [simulation, setSimulation] = useState<SimulationParams>({
    enabled: false,
    name: '',
    rainfallMultiplier: 1.0,
    uplandRainfallMm: 12,
    soilSaturationAdjustment: 0,
    tideSurgeOffsetMeters: 0,
    windSpeedKmh: 14,
    windDirectionDegrees: 235,
  });

  // Hydrologic Telemetry State
  const [currentWeather, setCurrentWeather] = useState<WeatherCurrent | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastPoint[]>([]);
  const [uplandWatershed, setUplandWatershed] = useState<UplandWatershedData | null>(null);
  const [soilSaturation, setSoilSaturation] = useState<SoilSaturationMetrics | null>(null);
  const [tideSurge, setTideSurge] = useState<TideSurgeData | null>(null);
  const [compoundRisk, setCompoundRisk] = useState<CompoundFloodRisk | null>(null);
  const [historicalBenchmarks, setHistoricalBenchmarks] = useState<HistoricalBenchmark[]>([]);
  const [barangayStatuses, setBarangayStatuses] = useState<BarangayFloodStatus[]>([]);

  // Section Refs for smooth scrolling
  const overviewRef = useRef<HTMLDivElement>(null);
  const forecastRef = useRef<HTMLDivElement>(null);
  const watershedRef = useRef<HTMLDivElement>(null);
  const tidesRef = useRef<HTMLDivElement>(null);
  const historicalRef = useRef<HTMLDivElement>(null);
  const barangaysRef = useRef<HTMLDivElement>(null);

  const loadData = useCallback(async (simParams?: SimulationParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchLiveWeatherData(simParams ?? simulation);
      setCurrentWeather(result.currentWeather);
      setHourlyForecast(result.hourlyForecast);
      setUplandWatershed(result.uplandWatershed);
      setSoilSaturation(result.soilSaturation);
      setTideSurge(result.tideSurge);
      setCompoundRisk(result.compoundRisk);
      setHistoricalBenchmarks(result.historicalBenchmarks);
      setBarangayStatuses(result.barangayStatuses);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch hydrologic telemetry');
    } finally {
      setIsLoading(false);
    }
  }, [simulation]);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateSimulation = (newSim: SimulationParams) => {
    setSimulation(newSim);
    loadData(newSim);
  };

  const handleResetToLive = () => {
    const liveSim: SimulationParams = {
      enabled: false,
      name: '',
      rainfallMultiplier: 1.0,
      uplandRainfallMm: 12,
      soilSaturationAdjustment: 0,
      tideSurgeOffsetMeters: 0,
      windSpeedKmh: 14,
      windDirectionDegrees: 235,
    };
    setSimulation(liveSim);
    loadData(liveSim);
  };

  const handleSelectSection = (sectionId: string) => {
    setActiveSection(sectionId);
    let targetRef: React.RefObject<HTMLDivElement | null> | null = null;
    if (sectionId === 'overview') targetRef = overviewRef;
    if (sectionId === 'forecast') targetRef = forecastRef;
    if (sectionId === 'watershed') targetRef = watershedRef;
    if (sectionId === 'tides') targetRef = tidesRef;
    if (sectionId === 'historical') targetRef = historicalRef;
    if (sectionId === 'barangays') targetRef = barangaysRef;

    if (targetRef?.current) {
      const headerOffset = 70;
      const elementPosition = targetRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header + Smartphone Bottom Nav Bar */}
      <Header
        onRefresh={() => loadData()}
        isLoading={isLoading}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        isSimulating={simulation.enabled}
        simulationName={simulation.name}
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
      />

      {/* Offline Mode Indicator */}
      <OfflineIndicator />

      {/* Simulation Active Notice Banner */}
      {simulation.enabled && (
        <div className="bg-amber-950/90 border-b border-amber-800/80 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs text-amber-200">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-[11px] sm:text-xs">
                <strong>SIMULATION ACTIVE:</strong> &quot;{simulation.name}&quot; (Rain: {simulation.rainfallMultiplier.toFixed(1)}x, Upland: {simulation.uplandRainfallMm}mm, Surge: {simulation.tideSurgeOffsetMeters >= 0 ? '+' : ''}{simulation.tideSurgeOffsetMeters.toFixed(2)}m).
              </span>
            </div>
            <button
              onClick={handleResetToLive}
              className="px-2.5 py-1 rounded-lg bg-amber-900/80 hover:bg-amber-800 text-amber-100 text-[11px] font-semibold whitespace-nowrap self-end sm:self-auto"
            >
              Exit Simulation
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8 pb-24 sm:pb-28 md:pb-8">
        {/* In-App PWA Install Banner */}
        <PWAInstallButton variant="banner" />

        {/* Hero Section: Location & Basin Context */}
        <section className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
          <div className="relative min-h-[260px] sm:min-h-[300px] w-full overflow-hidden flex flex-col justify-between p-4 sm:p-6 lg:p-8">
            {/* Background Layer: Satellite Image or Topographic Radar Mesh */}
            {heroMode === 'satellite' && !imageError ? (
              <img
                src={heroBasinImg || '/images/noveleta_coastal_basin.jpg'}
                alt="Satellite view of Noveleta coastal river delta meeting Manila Bay"
                className="absolute inset-0 w-full h-full object-cover brightness-70 scale-105 transition-opacity duration-300"
                referrerPolicy="no-referrer"
                onError={() => {
                  console.warn('Satellite image could not be loaded, using topographic radar fallback');
                  setImageError(true);
                  setHeroMode('topographic');
                }}
              />
            ) : (
              /* Resilient Topographic Radar Vector Background (Always renders 100% reliably) */
              <div className="absolute inset-0 w-full h-full bg-slate-950 overflow-hidden select-none">
                <svg viewBox="0 0 800 400" className="w-full h-full opacity-40" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <radialGradient id="radarPulse" cx="60%" cy="30%" r="50%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                      <stop offset="60%" stopColor="#083344" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#020617" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  {/* Grid Lines */}
                  {Array.from({ length: 9 }).map((_, i) => (
                    <line key={i} x1="0" y1={i * 50} x2="800" y2={i * 50} stroke="#1e293b" strokeWidth="1" />
                  ))}
                  {Array.from({ length: 17 }).map((_, i) => (
                    <line key={i} x1={i * 50} y1="0" x2={i * 50} y2="400" stroke="#1e293b" strokeWidth="1" />
                  ))}
                  {/* Radar Circles */}
                  <circle cx="500" cy="180" r="100" fill="none" stroke="#0e7490" strokeWidth="1.5" strokeDasharray="4 4" />
                  <circle cx="500" cy="180" r="180" fill="none" stroke="#0e7490" strokeWidth="1" opacity="0.6" />
                  <circle cx="500" cy="180" r="260" fill="url(#radarPulse)" />
                  {/* River Delta Path */}
                  <path
                    d="M 800,380 Q 650,300 520,240 T 380,180 Q 250,130 160,80 L 120,40"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="18"
                    strokeLinecap="round"
                    opacity="0.75"
                  />
                  <path
                    d="M 800,380 Q 650,300 520,240 T 380,180 Q 250,130 160,80 L 120,40"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeDasharray="8 6"
                  />
                </svg>
              </div>
            )}

            {/* Dark Scrim Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40 pointer-events-none" />

            {/* Top Non-Overlapping Header Row: Kicker Metadata on Left, View Toggle on Right */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono text-cyan-400">
                <span>Province of Cavite</span>
                <span aria-hidden="true">·</span>
                <span>Ylang-Ylang & San Juan Basin</span>
                <span aria-hidden="true">·</span>
                <span>Manila Bay Outfall</span>
              </div>

              {/* View Mode Toggle Controls */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs self-start sm:self-auto shrink-0 shadow-sm">
                <button
                  onClick={() => {
                    setImageError(false);
                    setHeroMode('satellite');
                  }}
                  className={`min-h-[34px] px-2.5 sm:px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    heroMode === 'satellite' && !imageError
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Satellite Aerial View"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Satellite Imagery</span>
                  <span className="sm:hidden text-[10px]">Photo</span>
                </button>

                <button
                  onClick={() => setHeroMode('topographic')}
                  className={`min-h-[34px] px-2.5 sm:px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    heroMode === 'topographic' || imageError
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Topographic Radar View"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Topographic Radar</span>
                  <span className="sm:hidden text-[10px]">Radar</span>
                </button>
              </div>
            </div>

            {/* Bottom Content: Headline, Description, Timestamp */}
            <div className="relative z-10 space-y-2">
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight text-balance">
                Noveleta Hydrologic & Surge Risk Engine
              </h1>
              <p className="text-[11px] sm:text-xs lg:text-sm text-slate-300 max-w-3xl leading-relaxed text-balance">
                Continuous compound flood intelligence integrating real-time local weather, 24-hour predictive risk curves, Tagaytay-Silang upland watershed discharge lag, multi-layer soil saturation markers, and Manila Bay tidal surge mechanics.
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 pt-1 text-[10px] sm:text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <span>Updated: {formatPhilippineTime(lastUpdated, 'time')}</span>
                  <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-[10px] text-cyan-300 font-semibold">
                    PST (UTC+8)
                  </span>
                </span>
                <span aria-hidden="true" className="hidden sm:inline">·</span>
                <span className="hidden sm:inline">Open-Meteo High-Res API + Astronomical Harmonics</span>
              </div>
            </div>
          </div>
        </section>

        {/* Loading Skeleton */}
        {isLoading && !currentWeather && (
          <div className="p-8 sm:p-12 rounded-2xl border border-slate-800 bg-slate-900 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
            <div className="text-sm font-semibold text-white">
              Synchronizing Noveleta & Upland Cavite Telemetry...
            </div>
            <div className="text-xs text-slate-400">
              Fetching atmospheric pressure, soil saturation layers, and calculating astronomical tide harmonics.
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 sm:p-6 rounded-2xl border border-rose-800/80 bg-rose-950/40 text-rose-200 flex items-start gap-3 sm:gap-4">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-sm font-bold">Telemetry Synchronization Notice</div>
              <div className="text-xs opacity-90">{error}</div>
              <button
                onClick={() => loadData()}
                className="mt-2 px-3 py-1.5 text-xs font-semibold bg-rose-900/60 hover:bg-rose-800 rounded-lg text-white"
              >
                Retry Connection
              </button>
            </div>
          </div>
        )}

        {/* Populated State */}
        {currentWeather && compoundRisk && (
          <>
            {/* 1. Current Risk Overview & Real-Time Weather */}
            <section ref={overviewRef} className="space-y-5 sm:space-y-6">
              <RiskOverviewCard
                compoundRisk={compoundRisk}
                onViewForecast={() => handleSelectSection('forecast')}
                onViewBarangays={() => handleSelectSection('barangays')}
              />

              <WeatherWidget current={currentWeather} hourly={hourlyForecast} />
            </section>

            {/* 2. 24-Hour Predictive Risk Line Graph */}
            <section ref={forecastRef} className="pt-1 sm:pt-2">
              <RiskForecastChart data={hourlyForecast} />
            </section>

            {/* 3. Upland Watershed & Soil Saturation Markers */}
            {uplandWatershed && soilSaturation && (
              <section ref={watershedRef} className="pt-1 sm:pt-2">
                <WatershedAndSoilPanel watershed={uplandWatershed} soil={soilSaturation} />
              </section>
            )}

            {/* 4. Coastal Tide & Storm Surge Monitoring */}
            {tideSurge && (
              <section ref={tidesRef} className="pt-1 sm:pt-2">
                <CoastalTidePanel tideSurge={tideSurge} />
              </section>
            )}

            {/* 5. Historical Comparison & Disaster Benchmarks */}
            <section ref={historicalRef} className="pt-1 sm:pt-2">
              <HistoricalComparisonPanel
                benchmarks={historicalBenchmarks}
                currentRainfall24h={currentWeather.precipitation * 6}
                currentSoilSaturation={soilSaturation?.aggregateSaturationPercent ?? 40}
                currentPeakTide={tideSurge?.nextHighTideMeters ?? 1.2}
              />
            </section>

            {/* 6. Barangay Inundation Matrix & Basin Map */}
            <section ref={barangaysRef} className="pt-1 sm:pt-2">
              <BarangayInundationMatrix barangays={barangayStatuses} />
            </section>
          </>
        )}
        {/* Official Safety & Emergency Disclaimer Banner */}
        <section className="pt-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/40 border border-amber-800/80 text-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Life-Safety & Official Evacuation Notice</span>
            </div>
            <p className="text-xs leading-relaxed text-amber-100/90">
              <strong>IMPORTANT DISCLAIMER:</strong> Do not rely on this app solely for life-safety or evacuation decisions. This platform provides automated predictive modeling and hydro-informatics for situational awareness. Always follow official weather warnings, flood advisories, and emergency evacuation orders issued by PAGASA, NDRRMC, Cavite PDRRMO, and local Noveleta MDRRMO (Municipal Disaster Risk Reduction and Management Office).
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-3 text-[11px] font-mono text-amber-300/80">
              <span>Noveleta MDRRMO Hotline: (046) 438-1207 / 0919-063-2281</span>
              <span>·</span>
              <span>Cavite PDRRMO: (046) 419-0742</span>
              <span>·</span>
              <span>Philippine Red Cross: 143</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 pb-20 sm:pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">Noveleta FloodWatch</span>
              <span aria-hidden="true">·</span>
              <span>Cavite Hydro-Informatics & Coastal Predictive Engine</span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-4 text-slate-400 text-[11px] sm:text-xs">
              <span>Open-Meteo Weather & Marine API</span>
              <span aria-hidden="true">·</span>
              <span>NAMRIA Manila Bay Tidal Datum (MLLW)</span>
              <span aria-hidden="true">·</span>
              <span>PST (UTC+8)</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-900 text-[11px] text-slate-500 text-center leading-relaxed">
            Do not rely on this app solely for life-safety decisions. Always follow official weather warnings, flood advisories, and emergency evacuation instructions from PAGASA, NDRRMC, Cavite PDRRMO, and local Noveleta MDRRMO.
          </div>
        </div>
      </footer>

      {/* Scenario Simulator Modal */}
      <ScenarioSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        simulation={simulation}
        onUpdateSimulation={handleUpdateSimulation}
        onResetToLive={handleResetToLive}
      />
    </div>
  );
}
