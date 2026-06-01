from sqlalchemy.orm import Session

from app.models.device import Device


def make_device(
    db: Session,
    device_id: str = "TEST-001",
    type: str = "elevator",
    company: str = "Brookfield Properties",
    name: str = "Test Elevator",
    location: str = "Test Building",
    timezone: str = "America/New_York",
    floor_count: int | None = 10,
    installed_date: str = "2024-01-01",
    reading_types: list[str] | None = None,
    alert_thresholds: dict | None = None,
) -> Device:
    if reading_types is None:
        reading_types = ["current", "frequency", "motor_status"]
    if alert_thresholds is None:
        alert_thresholds = {
            "current_high": 180.0,
            "current_low": 5.0,
            "frequency_high": 65.0,
            "frequency_low": 55.0,
        }
    device = Device(
        device_id=device_id,
        type=type,
        company=company,
        name=name,
        location=location,
        timezone=timezone,
        floor_count=floor_count,
        installed_date=installed_date,
        reading_types=reading_types,
        alert_thresholds=alert_thresholds,
    )
    db.add(device)
    db.commit()
    db.refresh(device)
    return device
