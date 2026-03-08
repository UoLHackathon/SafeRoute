import type {
  RouteMode,
  RouteOption,
  SafeStop,
  WalkSession,
  HeatmapPoint,
  IncidentReport,
  TrustedContact,
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(body || `API error ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export function calculateRoute(
  startLat: number,
  startLong: number,
  destLat: number,
  destLong: number,
  mode: RouteMode
): Promise<RouteOption> {
  return request<RouteOption>("/api/routes/calculate", {
    method: "POST",
    body: JSON.stringify({ startLat, startLong, destLat, destLong, mode }),
  });
}

export async function fetchAllRoutes(
  startLat: number,
  startLong: number,
  destLat: number,
  destLong: number
): Promise<RouteOption[]> {
  const modes: RouteMode[] = ["FASTEST", "LOWER_RISK", "COMFORT"];
  return Promise.all(
    modes.map((mode) =>
      calculateRoute(startLat, startLong, destLat, destLong, mode)
    )
  );
}

export function fetchSafeStops(routeId: string): Promise<SafeStop[]> {
  return request<SafeStop[]>(`/api/safe-stops`);
}

export function submitReport(
  report: Omit<IncidentReport, "id">
): Promise<IncidentReport> {
  return request<IncidentReport>("/reports", {
    method: "POST",
    body: JSON.stringify(report),
  });
}

export function fetchReports(
  bounds?: { north: number; south: number; east: number; west: number }
): Promise<IncidentReport[]> {
  const q = bounds
    ? `?north=${bounds.north}&south=${bounds.south}&east=${bounds.east}&west=${bounds.west}`
    : "";
  return request<IncidentReport[]>(`/reports${q}`);
}

export function startWalkSession(body: {
  routeType: string;
  expectedMinutes: number;
  contactId: string;
}): Promise<WalkSession> {
  return request<WalkSession>("/walk/start", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function checkIn(sessionId: string): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>(`/walk/${encodeURIComponent(sessionId)}/checkin`, {
    method: "POST",
  });
}

export function endWalkSession(sessionId: string): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>(`/walk/${encodeURIComponent(sessionId)}/end`, {
    method: "POST",
  });
}

export function fetchContacts(): Promise<TrustedContact[]> {
  return request<TrustedContact[]>("/contacts");
}

export function addContact(
  contact: Omit<TrustedContact, "id">
): Promise<TrustedContact> {
  return request<TrustedContact>("/contacts", {
    method: "POST",
    body: JSON.stringify(contact),
  });
}

export function deleteContact(contactId: string): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>(`/contacts/${encodeURIComponent(contactId)}`, {
    method: "DELETE",
  });
}

export async function geocode(
  query: string
): Promise<[number, number] | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      { headers: { "User-Agent": "SafeRouteAI/1.0" } }
    );
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  } catch {
    return null;
  }
}

export function fetchHeatmapData(
  bounds: { north: number; south: number; east: number; west: number }
): Promise<HeatmapPoint[]> {
  const q = `north=${bounds.north}&south=${bounds.south}&east=${bounds.east}&west=${bounds.west}`;
  return request<HeatmapPoint[]>(`/heatmap?${q}`);
}

export async function fetchAllSafeStops(
  category?: string
): Promise<SafeStop[]> {
  const all = await request<SafeStop[]>(`/api/safe-stops`);
  if (!category) return all;
  return all.filter((s) => s.category === category);
}

export function fetchAdminIncidents(): Promise<IncidentReport[]> {
  return request<IncidentReport[]>("/admin/incidents");
}

export function fetchAdminSafeStops(): Promise<SafeStop[]> {
  return request<SafeStop[]>("/admin/safe-stops");
}

export function seedData(): Promise<{ message: string }> {
  return request<{ message: string }>("/admin/seed", { method: "POST" });
}
