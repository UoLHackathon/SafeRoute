import type {
  RouteOption,
  SafeStop,
  WalkSession,
  HeatmapPoint,
  IncidentReport,
  TrustedContact,
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";

// ── Generic fetch helper with error handling ────────────────────────────────

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

// ── Routes ──────────────────────────────────────────────────────────────────

export function fetchRoutes(
  start: [number, number],
  end: [number, number]
): Promise<RouteOption[]> {
  return request<RouteOption[]>(
    `/routes?start=${start[0]},${start[1]}&end=${end[0]},${end[1]}`
  );
}

// ── Safe stops ──────────────────────────────────────────────────────────────

export function fetchSafeStops(routeId: string): Promise<SafeStop[]> {
  return request<SafeStop[]>(`/safe-stops?routeId=${encodeURIComponent(routeId)}`);
}

// ── Incident reports ────────────────────────────────────────────────────────

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

// ── Walk session ────────────────────────────────────────────────────────────

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

// ── Trusted contacts ────────────────────────────────────────────────────────

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

// ── Geocode (via backend) ────────────────────────────────────────────────────

export async function geocode(
  query: string
): Promise<[number, number] | null> {
  try {
    const data = await request<{ lat: number; lng: number }>(
      `/geocode?query=${encodeURIComponent(query)}`
    );
    return [data.lat, data.lng];
  } catch {
    return null;
  }
}

// ── Heatmap data ────────────────────────────────────────────────────────────

export function fetchHeatmapData(
  bounds: { north: number; south: number; east: number; west: number }
): Promise<HeatmapPoint[]> {
  const q = `north=${bounds.north}&south=${bounds.south}&east=${bounds.east}&west=${bounds.west}`;
  return request<HeatmapPoint[]>(`/heatmap?${q}`);
}
