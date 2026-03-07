import mapboxgl from "mapbox-gl";

/** Initialise the Mapbox access token once. */
export function initMapbox(): void {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
}

// ── Route line colours ──────────────────────────────────────────────────────

export const ROUTE_COLORS: Record<string, string> = {
  fastest: "#3B82F6",   // blue-500
  lowerRisk: "#22C55E", // green-500
  comfort: "#EAB308",   // yellow-500
};

// ── Safe-stop icon mapping ──────────────────────────────────────────────────

export const SAFE_STOP_ICONS: Record<string, string> = {
  pharmacy: "💊",
  hospital: "🏥",
  police: "🚔",
  late_open_shop: "🏪",
};

// ── Default map config ──────────────────────────────────────────────────────

export const DEFAULT_CENTER: [number, number] = [-73.9857, 40.7484]; // NYC
export const DEFAULT_ZOOM = 14;
