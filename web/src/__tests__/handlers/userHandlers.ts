import { http, HttpResponse } from "msw";
import type { User } from "@/features/alerts/types";

export const mockUsers: User[] = [
  { id: "user-1", name: "Alice Chen", role: "Building Manager", company: "Brookfield Properties" },
  { id: "user-2", name: "Bob Martinez", role: "Technician", company: "Brookfield Properties" },
];

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const userHandlers = [
  http.get(`${BASE}/users`, () => {
    return HttpResponse.json(mockUsers);
  }),
];
