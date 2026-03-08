
export type RouteMode = "FASTEST" | "LOWER_RISK" | "COMFORT";

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface RouteOption {
  mode: RouteMode;
  distanceMeters: number;
  durationSeconds: number;
  riskScore: number;
  confidence: string;
  reasons: string[];
  path: Coordinate[];
}

export type IncidentType =
  | "harassment"
  | "suspicious_behaviour"
  | "poorly_lit"
  | "isolated_street";

export interface IncidentReport {
  id?: string;
  latitude: number;
  longitude: number;
  type: IncidentType;
  timestamp: string;
  description: string;
}

export type SafeStopCategory =
  | "pharmacy"
  | "hospital"
  | "police"
  | "late_open_shop";

export interface SafeStop {
  id: string;
  name: string;
  category: SafeStopCategory;
  latitude: number;
  longitude: number;
}

export interface WalkSession {
  id: string;
  routeMode: RouteMode;
  startTime: string;
  expectedArrival: string;
  isActive: boolean;
  lastCheckIn?: string;
}

export interface TrustedContact {
  id?: string;
  name: string;
  phone: string;
  email?: string;
}

export interface HeatmapPoint {
  latitude: number;
  longitude: number;
  weight: number;
}

export interface ApiError {
  message: string;
  status: number;
}
