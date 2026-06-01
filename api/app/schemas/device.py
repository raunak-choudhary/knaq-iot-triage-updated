from typing import Any

from pydantic import BaseModel, ConfigDict


class DeviceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    device_id: str
    type: str
    company: str
    name: str
    location: str
    timezone: str
    floor_count: int | None
    installed_date: str
    reading_types: list[str]
    alert_thresholds: dict[str, Any]


class ReadingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    device_id: str
    timestamp_utc: int
    timestamp_local: str
    reading_name: str
    reading_value: float
    breaches_threshold: bool
    is_anomaly: bool
