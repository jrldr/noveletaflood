/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FloodRiskLevel = 'minimal' | 'low' | 'moderate' | 'high' | 'critical';

export interface WeatherCurrent {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  rain: number;
  surfacePressure: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  weatherCode: number;
  weatherDescription: string;
  isDay: boolean;
  time: string;
}

export interface HourlyForecastPoint {
  time: string;
  hour: number;
  formattedTime: string;
  temperature: number;
  precipitation: number;
  precipitationProbability: number;
  surfacePressure: number;
  soilMoistureTop: number; // m³/m³
  soilMoistureMid: number; // m³/m³
  soilMoistureDeep: number; // m³/m³
  // Synthesized hydrologic predictions
  tideHeight: number; // meters relative to MSL
  coastalSurge: number; // meters
  uplandRunoffRate: number; // m³/s
  soilSaturationPercent: number; // 0-100%
  floodRiskScore: number; // 0-100%
  riskLevel: FloodRiskLevel;
}

export interface UplandWatershedData {
  locationName: string;
  elevationMeters: number;
  currentRainRate: number; // mm/h
  accumulatedRain6h: number; // mm
  soilSaturation: number; // %
  estimatedDischarge: number; // m³/s
  transitLagHours: number; // hours to reach Noveleta
  estimatedArrivalTime: string;
  status: 'nominal' | 'elevated' | 'surging' | 'flash_flood_risk';
}

export interface SoilSaturationMetrics {
  topsoilMoisture: number; // % (0-1cm)
  midsoilMoisture: number; // % (1-3cm)
  deepsoilMoisture: number; // % (3-9cm)
  aggregateSaturationPercent: number; // %
  antecedentMoistureCondition: 'AMC-I (Dry)' | 'AMC-II (Average)' | 'AMC-III (Saturated)';
  runoffCoefficient: number; // Rational C factor (0.2 - 0.95)
  infiltrationCapacityMmPerHour: number;
  soilTypeDescription: string;
}

export interface TideSurgeData {
  currentTideMeters: number; // Astronomical tide relative to MLLW (m)
  datumMLLW: number; // Total combined water level relative to MLLW (m)
  tideMsl: number; // Astronomical tide relative to MSL (m)
  totalCombinedWaterLevel: number; // Total combined water level (Tide + Surge) relative to MLLW (m)
  totalCombinedMsl: number; // Total combined water level relative to MSL (m)
  phase: 'rising' | 'falling' | 'high_slack' | 'low_slack';
  todayHighTide?: { time: string; height: number };
  todayLowTide?: { time: string; height: number };
  nextHighTideTime: string; // Formatted in PST (UTC+8)
  nextHighTideMeters: number; // MLLW (m)
  nextLowTideTime: string; // Formatted in PST (UTC+8)
  nextLowTideMeters: number; // MLLW (m)
  barometricSurgeMeters: number;
  windDrivenSurgeMeters: number;
  totalSurgeMeters: number;
  estuaryBackflowStatus: 'free_drainage' | 'restricted_outflow' | 'critical_backflow';
  stationName: string;
  datumReference: string;
  timeZoneLabel: string;
}

export interface CompoundFloodRisk {
  overallScore: number; // 0 - 100
  riskLevel: FloodRiskLevel;
  primaryRiskDrivers: {
    name: string;
    contributionPercent: number;
    valueLabel: string;
    severity: 'nominal' | 'elevated' | 'severe';
  }[];
  estuaryChokeFactor: number; // 1.0 = normal, 1.5 - 2.5 = backflow multiplier
  peakRiskTime: string;
  peakRiskScore: number;
  historicalSeverityEquivalent: string;
  evacuationRecommended: boolean;
  actionGuidance: string[];
}

export interface HistoricalBenchmark {
  eventName: string;
  date: string;
  rainfall24hMm: number;
  uplandRainfallMm: number;
  soilSaturationPercent: number;
  peakTideMeters: number;
  maxFloodDepthMeters: number;
  impactSummary: string;
  noveletaSubmergedPercent: number;
  similarityToCurrentPercent: number;
}

export interface BarangayFloodStatus {
  id: string;
  name: string;
  zone: 'Coastal / Estuary' | 'Riverine (Ylang-Ylang)' | 'Inland Lowland' | 'Slight Upland';
  elevationMeters: number;
  riskScore: number; // 0 - 100
  riskLevel: FloodRiskLevel;
  predictedWaterDepthMeters: number;
  primaryThreat: 'River Overflow' | 'Tidal Surge Backflow' | 'Runoff Ponding' | 'Compound Deluge';
  evacuationCenter: string;
  populationEstimate: number;
}

export interface SimulationParams {
  enabled: boolean;
  name: string;
  rainfallMultiplier: number;
  uplandRainfallMm: number;
  soilSaturationAdjustment: number; // -30 to +40%
  tideSurgeOffsetMeters: number; // -0.5 to +1.5m
  windSpeedKmh: number;
  windDirectionDegrees: number;
}
