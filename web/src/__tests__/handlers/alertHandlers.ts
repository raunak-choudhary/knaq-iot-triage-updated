import { http, HttpResponse } from "msw";
import type { AlertListItem, Alert, PaginatedAlertsResponse } from "@/features/alerts/types";

const now = Date.now();

// Mutable state to simulate server state updates
const alertsState: Map<string, AlertListItem> = new Map();

export const mockAlerts: AlertListItem[] = [
  {
    id: "alert-1",
    device_id: "ELV-001",
    device_name: "Elevator 1",
    device_location: "Building A, Floor 3",
    alert_type: "temperature",
    severity: "critical",
    title: "High Temperature Alert",
    status: "new",
    timestamp_utc: now - 5 * 60 * 1000,
    timestamp_local: new Date(now - 5 * 60 * 1000).toISOString(),
    assigned_to: null,
    assignee_name: null,
    reading_value: 95.5,
    threshold: 85.0,
    reading_name: "temperature",
  },
  {
    id: "alert-2",
    device_id: "ESC-001",
    device_name: "Escalator 1",
    device_location: "Building B, Floor 1",
    alert_type: "door_fault",
    severity: "warning",
    title: "Door Fault Detected",
    status: "acknowledged",
    timestamp_utc: now - 2 * 60 * 60 * 1000,
    timestamp_local: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
    assigned_to: "user-1",
    assignee_name: "Alice Chen",
    reading_value: null,
    threshold: null,
    reading_name: null,
  },
  {
    id: "alert-3",
    device_id: "CMP-001",
    device_name: "Compressor 1",
    device_location: "Building C",
    alert_type: "pressure",
    severity: "info",
    title: "Low Pressure Alert",
    status: "resolved",
    timestamp_utc: now - 24 * 60 * 60 * 1000,
    timestamp_local: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
    assigned_to: null,
    assignee_name: null,
    reading_value: 50.0,
    threshold: 60.0,
    reading_name: "pressure",
  },
];

// Initialize state from mock
function resetAlertState() {
  alertsState.clear();
  mockAlerts.forEach((a) => alertsState.set(a.id, { ...a }));
}
resetAlertState();

export const mockAlertDetail: Alert = {
  ...mockAlerts[0],
  acknowledged_at: null,
  resolved_at: null,
  resolution_type: null,
  resolution_root_cause: null,
  resolution_action_taken: null,
  resolution_preventive_measures: null,
  resolution_time_spent_minutes: null,
  timeline: [
    {
      id: 1,
      timestamp: now - 5 * 60 * 1000,
      action: "created",
      user_name: null,
      details: "Alert created",
      note: null,
    },
  ],
};

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const alertHandlers = [
  // Reset state on each test via afterEach calling server.resetHandlers
  http.get(`${BASE}/alerts`, ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.getAll("status");
    const severity = url.searchParams.getAll("severity");
    const q = url.searchParams.get("q");

    let filtered = Array.from(alertsState.values());
    if (status.length) {
      filtered = filtered.filter((a) => status.includes(a.status));
    }
    if (severity.length) {
      filtered = filtered.filter((a) => severity.includes(a.severity));
    }
    if (q) {
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(q.toLowerCase()) ||
          a.device_name.toLowerCase().includes(q.toLowerCase())
      );
    }

    // Compute status counts across all filtered items (not paginated)
    const statusCounts = { new: 0, acknowledged: 0, resolved: 0, dismissed: 0 };
    filtered.forEach((a) => {
      if (a.status in statusCounts) {
        (statusCounts as Record<string, number>)[a.status]++;
      }
    });

    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("page_size") || "20", 10);
    const total = filtered.length;
    const items = filtered.slice((page - 1) * pageSize, page * pageSize);

    const response: PaginatedAlertsResponse = {
      items,
      total,
      page,
      page_size: pageSize,
      total_pages: Math.max(1, Math.ceil(total / pageSize)),
      status_counts: statusCounts,
    };
    return HttpResponse.json(response);
  }),

  http.get(`${BASE}/alerts/:id`, ({ params }) => {
    const { id } = params;
    if (id === "alert-1") {
      const current = alertsState.get("alert-1");
      const detail: Alert = {
        ...mockAlertDetail,
        ...(current ? { status: current.status } : {}),
        timeline: [
          {
            id: 1,
            timestamp: now - 5 * 60 * 1000,
            action: "created",
            user_name: null,
            details: "Alert created",
            note: null,
          },
          ...(current?.status === "acknowledged"
            ? [
                {
                  id: 2,
                  timestamp: now - 1000,
                  action: "acknowledged",
                  user_name: "Alice Chen",
                  details: null,
                  note: null,
                },
              ]
            : []),
        ],
      };
      return HttpResponse.json(detail);
    }
    if (id === "alert-2") {
      const alert2: Alert = {
        ...mockAlerts[1],
        acknowledged_at: now - 2 * 60 * 60 * 1000,
        resolved_at: null,
        resolution_type: null,
        resolution_root_cause: null,
        resolution_action_taken: null,
        resolution_preventive_measures: null,
        resolution_time_spent_minutes: null,
        timeline: [
          { id: 1, timestamp: now - 3 * 60 * 60 * 1000, action: "created", user_name: null, details: null, note: null },
          { id: 2, timestamp: now - 2 * 60 * 60 * 1000, action: "acknowledged", user_name: "Alice Chen", details: null, note: null },
        ],
      };
      return HttpResponse.json(alert2);
    }
    if (id === "alert-3") {
      const alert3: Alert = {
        ...mockAlerts[2],
        acknowledged_at: now - 2 * 24 * 60 * 60 * 1000,
        resolved_at: now - 24 * 60 * 60 * 1000,
        resolution_type: "repaired",
        resolution_root_cause: "Worn bearings",
        resolution_action_taken: "Replaced bearings",
        resolution_preventive_measures: null,
        resolution_time_spent_minutes: 120,
        timeline: [
          { id: 1, timestamp: now - 3 * 24 * 60 * 60 * 1000, action: "created", user_name: null, details: null, note: null },
          { id: 2, timestamp: now - 24 * 60 * 60 * 1000, action: "resolved", user_name: "Bob Martinez", details: "repaired", note: null },
        ],
      };
      return HttpResponse.json(alert3);
    }
    return HttpResponse.json({ detail: "Not found" }, { status: 404 });
  }),

  http.post(`${BASE}/alerts/:id/acknowledge`, ({ params }) => {
    const { id } = params;
    const alert = alertsState.get(id as string);
    if (!alert) return HttpResponse.json({ detail: "Not found" }, { status: 404 });
    if (alert.status !== "new") {
      return HttpResponse.json({ detail: `Conflict: alert is ${alert.status}` }, { status: 409 });
    }
    const updated = { ...alert, status: "acknowledged" as const };
    alertsState.set(id as string, updated);
    const updatedDetail: Alert = {
      ...mockAlertDetail,
      id: id as string,
      status: "acknowledged",
      acknowledged_at: Date.now(),
      timeline: [
        ...mockAlertDetail.timeline,
        {
          id: 2,
          timestamp: Date.now(),
          action: "acknowledged",
          user_name: "Alice Chen",
          details: null,
          note: null,
        },
      ],
    };
    return HttpResponse.json(updatedDetail);
  }),

  http.post(`${BASE}/alerts/:id/notes`, async ({ params, request }) => {
    const { id } = params;
    const body = await request.json() as { note: string };
    const updated: Alert = {
      ...mockAlertDetail,
      id: id as string,
      timeline: [
        ...mockAlertDetail.timeline,
        {
          id: 99,
          timestamp: Date.now(),
          action: "note",
          user_name: "Alice Chen",
          details: null,
          note: body.note,
        },
      ],
    };
    return HttpResponse.json(updated);
  }),

  http.post(`${BASE}/alerts/:id/resolve`, async ({ params, request }) => {
    const { id } = params;
    const body = await request.json() as Record<string, unknown>;
    const resolved: Alert = {
      ...mockAlertDetail,
      id: id as string,
      status: "resolved",
      resolved_at: Date.now(),
      resolution_type: body.resolution_type as string,
      resolution_root_cause: body.root_cause as string,
      resolution_action_taken: body.action_taken as string,
      resolution_preventive_measures: null,
      resolution_time_spent_minutes: null,
      timeline: [...mockAlertDetail.timeline],
    };
    return HttpResponse.json(resolved);
  }),

  http.post(`${BASE}/alerts/:id/assign`, async ({ params, request }) => {
    const body = await request.json() as { assignee_id: string };
    const updated: Alert = {
      ...mockAlertDetail,
      id: params.id as string,
      assigned_to: body.assignee_id,
      assignee_name: "Alice Chen",
      timeline: [...mockAlertDetail.timeline],
    };
    return HttpResponse.json(updated);
  }),

  // Bulk endpoints
  http.post(`${BASE}/alerts/bulk/acknowledge`, async ({ request }) => {
    const body = await request.json() as { alert_ids: string[] };
    body.alert_ids.forEach((id) => {
      const alert = alertsState.get(id);
      if (alert && alert.status === "new") {
        alertsState.set(id, { ...alert, status: "acknowledged" });
      }
    });
    return HttpResponse.json({ succeeded: body.alert_ids.length, failed: 0, errors: [] });
  }),

  http.post(`${BASE}/alerts/bulk/assign`, async ({ request }) => {
    const body = await request.json() as { alert_ids: string[]; assignee_id: string };
    return HttpResponse.json({ succeeded: body.alert_ids.length, failed: 0, errors: [] });
  }),

  // Stats endpoint
  http.get(`${BASE}/alerts/stats`, () => {
    return HttpResponse.json({
      total_by_status: { new: 1, acknowledged: 1, resolved: 1, dismissed: 0 },
      total_by_severity: { critical: 1, warning: 1, info: 1 },
      mttr_hours: 4.5,
      resolved_this_week: 1,
      resolved_last_week: 0,
      dismissal_rate: 0,
      volume_7d: [],
      anomaly_count: 3,
    });
  }),
];

// Export reset function for afterEach in tests
export { resetAlertState };
