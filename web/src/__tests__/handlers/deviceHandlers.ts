import { http, HttpResponse } from "msw";
import type { Device } from "@/features/alerts/types";

export const mockDevices: Device[] = [
  {
    device_id: "ELV-001",
    type: "elevator",
    company: "Brookfield Properties",
    name: "Elevator 1",
    location: "Building A, Floor 3",
    timezone: "America/New_York",
    floor_count: 20,
    installed_date: "2020-01-15",
    reading_types: ["temperature", "humidity"],
    alert_thresholds: { temperature: 85 },
  },
];

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const deviceHandlers = [
  http.get(`${BASE}/devices`, () => {
    return HttpResponse.json(mockDevices);
  }),

  http.get(`${BASE}/devices/:id`, ({ params }) => {
    const device = mockDevices.find((d) => d.device_id === params.id);
    if (!device) {
      return HttpResponse.json({ detail: "Not found" }, { status: 404 });
    }
    return HttpResponse.json(device);
  }),
];
