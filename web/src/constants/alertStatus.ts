import type { AlertStatus } from "@/features/alerts/types";

export const STATUS_COLOR: Record<
  AlertStatus,
  "default" | "primary" | "success" | "warning"
> = {
  new: "warning",
  acknowledged: "primary",
  resolved: "success",
  dismissed: "default",
};

export const STATUS_LABEL: Record<AlertStatus, string> = {
  new: "New",
  acknowledged: "Acknowledged",
  resolved: "Resolved",
  dismissed: "Dismissed",
};
