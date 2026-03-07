// ── Route types ──────────────────────────────────────────────────────────────

export type RouteType = "fastest" | "lowerRisk" | "comfort";

export interface RouteOption {
  type: RouteType;
  duration: number; // minutes
  riskScore: number; // 0‒1
  geometry: [number, number][]; // [lng, lat] pairs
}

// ── Incident / Report types ─────────────────────────────────────────────────

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

// ── Safe‑stop types ─────────────────────────────────────────────────────────

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

// ── Walk session ────────────────────────────────────────────────────────────

export interface WalkSession {
  id: string;
  routeType: RouteType;
  startTime: string;
  expectedArrival: string;
  isActive: boolean;
  lastCheckIn?: string;
}

// ── Trusted contact ─────────────────────────────────────────────────────────

export interface TrustedContact {
  id?: string;
  name: string;
  phone: string;
  email?: string;
}

// ── Heatmap data ────────────────────────────────────────────────────────────

export interface HeatmapPoint {
  latitude: number;
  longitude: number;
  weight: number; // 0‒1
}

// ── API response wrappers ───────────────────────────────────────────────────

export interface ApiError {
  message: string;
  status: number;
}
