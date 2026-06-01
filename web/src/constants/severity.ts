import type { Severity } from "@/features/alerts/types";

export const SEVERITY_COLOR: Record<Severity, "error" | "warning" | "info"> = {
  critical: "error",
  warning: "warning",
  info: "info",
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  critical: "Critical",
  warning: "Warning",
  info: "Info",
};
