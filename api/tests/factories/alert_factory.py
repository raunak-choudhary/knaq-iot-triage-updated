import uuid

from sqlalchemy.orm import Session

from app.models.alert import Alert
from app.models.alert_timeline import AlertTimeline


def make_alert(
    db: Session,
    device_id: str = "TEST-001",
    alert_type: str = "high_current",
    severity: str = "warning",
    title: str | None = None,
    status: str = "new",
    timestamp_utc: int = 1750000000000,
    timestamp_local: str = "2025-06-15T12:00:00-04:00",
    assigned_to: str | None = None,
    threshold: float | None = 180.0,
    reading_value: float | None = 185.0,
    reading_name: str | None = "current",
    with_timeline: bool = True,
) -> Alert:
    if title is None:
        title = f"{alert_type.replace('_', ' ').title()} on Device"
    alert = Alert(
        id=uuid.uuid4().hex,
        device_id=device_id,
        alert_type=alert_type,
        severity=severity,
        title=title,
        status=status,
        timestamp_utc=timestamp_utc,
        timestamp_local=timestamp_local,
        assigned_to=assigned_to,
        threshold=threshold,
        reading_value=reading_value,
        reading_name=reading_name,
    )
    db.add(alert)
    db.flush()

    if with_timeline:
        entry = AlertTimeline(
            alert_id=alert.id,
            timestamp=timestamp_utc,
            action="created",
            user_name=None,
            details="Alert created from device message",
            note=None,
        )
        db.add(entry)

    db.commit()
    db.refresh(alert)
    return alert
