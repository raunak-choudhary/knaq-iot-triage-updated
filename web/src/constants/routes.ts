export const ROUTES = {
  alerts: "/alerts",
  alertDetail: (id: string) => `/alerts/${id}`,
  analytics: "/analytics",
} as const;
