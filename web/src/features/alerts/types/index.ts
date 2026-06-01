export type Severity = "critical" | "warning" | "info";
export type AlertStatus = "new" | "acknowledged" | "resolved" | "dismissed";

export interface AlertListItem {
  id: string;
  device_id: string;
  device_name: string;
  device_location: string;
  alert_type: string;
  severity: Severity;
  title: string;
  status: AlertStatus;
  timestamp_utc: number;
  timestamp_local: string;
  assigned_to: string | null;
  assignee_name: string | null;
  reading_value: number | null;
  threshold: number | null;
  reading_name: string | null;
}

export interface TimelineEntry {
  id: number;
  timestamp: number;
  action: string;
  user_name: string | null;
  details: string | null;
  note: string | null;
}

export interface Alert extends AlertListItem {
  acknowledged_at: number | null;
  resolved_at: number | null;
  resolution_type: string | null;
  resolution_root_cause: string | null;
  resolution_action_taken: string | null;
  resolution_preventive_measures: string | null;
  resolution_time_spent_minutes: number | null;
  timeline: TimelineEntry[];
}

export type AlertResponse = Alert;

export interface Device {
  device_id: string;
  type: string;
  company: string;
  name: string;
  location: string;
  timezone: string;
  floor_count: number | null;
  installed_date: string;
  reading_types: string[];
  alert_thresholds: Record<string, number>;
}


export interface User {
  id: string;
  name: string;
  role: string;
  company: string;
}

export interface StatusCounts {
  new: number;
  acknowledged: number;
  resolved: number;
  dismissed: number;
}

export interface PaginatedAlertsResponse {
  items: AlertListItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  status_counts: StatusCounts;
}

export interface SeverityCounts {
  critical: number;
  warning: number;
  info: number;
}

export interface VolumeDayEntry {
  date: string;
  count: number;
}

export interface AlertStats {
  total_by_status: StatusCounts;
  total_by_severity: SeverityCounts;
  mttr_hours: number | null;
  resolved_this_week: number;
  resolved_last_week: number;
  dismissal_rate: number;
  volume_7d: VolumeDayEntry[];
  anomaly_count: number;
}

export interface BulkOperationResult {
  succeeded: number;
  failed: number;
  errors: { id: string; error: string }[];
}

export interface Reading {
  id: number;
  device_id: string;
  timestamp_utc: number;
  timestamp_local: string;
  reading_name: string;
  reading_value: number;
  breaches_threshold: boolean;
  is_anomaly: boolean;
}
