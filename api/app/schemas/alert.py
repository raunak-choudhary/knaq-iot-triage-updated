from pydantic import BaseModel, ConfigDict

from app.schemas.common import StatusCounts


class TimelineEntry(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    timestamp: int
    action: str
    user_name: str | None
    details: str | None
    note: str | None


class AlertListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    device_id: str
    device_name: str
    device_location: str
    alert_type: str
    severity: str
    title: str
    status: str
    timestamp_utc: int
    timestamp_local: str
    assigned_to: str | None
    assignee_name: str | None
    reading_value: float | None
    threshold: float | None
    reading_name: str | None


class AlertResponse(AlertListItem):
    acknowledged_at: int | None
    resolved_at: int | None
    resolution_type: str | None
    resolution_root_cause: str | None
    resolution_action_taken: str | None
    resolution_preventive_measures: str | None
    resolution_time_spent_minutes: int | None
    timeline: list[TimelineEntry]


class SeverityCounts(BaseModel):
    critical: int = 0
    warning: int = 0
    info: int = 0


class VolumeDayEntry(BaseModel):
    date: str
    count: int


class AlertStatsResponse(BaseModel):
    total_by_status: StatusCounts
    total_by_severity: SeverityCounts
    mttr_hours: float | None
    resolved_this_week: int
    resolved_last_week: int
    dismissal_rate: float
    volume_7d: list[VolumeDayEntry]
    anomaly_count: int


class PaginatedAlertsResponse(BaseModel):
    items: list[AlertListItem]
    total: int
    page: int
    page_size: int
    total_pages: int
    status_counts: StatusCounts


class AcknowledgeRequest(BaseModel):
    pass


class AssignRequest(BaseModel):
    assignee_id: str
    note: str | None = None


class ResolveRequest(BaseModel):
    resolution_type: str
    root_cause: str
    action_taken: str
    preventive_measures: str | None = None
    time_spent_minutes: int | None = None


class NoteRequest(BaseModel):
    note: str


class DismissRequest(BaseModel):
    note: str | None = None


class BulkAcknowledgeRequest(BaseModel):
    alert_ids: list[str]


class BulkAssignRequest(BaseModel):
    alert_ids: list[str]
    assignee_id: str
    note: str | None = None


class BulkOperationResult(BaseModel):
    succeeded: int
    failed: int
    errors: list[dict]
