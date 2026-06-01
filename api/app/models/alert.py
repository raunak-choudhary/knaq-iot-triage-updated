from sqlalchemy import BigInteger, Float, ForeignKey, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    device_id: Mapped[str] = mapped_column(String, ForeignKey("devices.device_id"), nullable=False)
    alert_type: Mapped[str] = mapped_column(String, nullable=False)
    severity: Mapped[str] = mapped_column(String, nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    threshold: Mapped[float | None] = mapped_column(Float, nullable=True)
    reading_value: Mapped[float | None] = mapped_column(Float, nullable=True)
    reading_name: Mapped[str | None] = mapped_column(String, nullable=True)
    timestamp_utc: Mapped[int] = mapped_column(BigInteger, nullable=False)
    timestamp_local: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False, default="new")
    assigned_to: Mapped[str | None] = mapped_column(
        String, ForeignKey("users.id"), nullable=True
    )
    acknowledged_at: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    resolved_at: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    resolution_type: Mapped[str | None] = mapped_column(String, nullable=True)
    resolution_root_cause: Mapped[str | None] = mapped_column(String, nullable=True)
    resolution_action_taken: Mapped[str | None] = mapped_column(String, nullable=True)
    resolution_preventive_measures: Mapped[str | None] = mapped_column(String, nullable=True)
    resolution_time_spent_minutes: Mapped[int | None] = mapped_column(Integer, nullable=True)

    __table_args__ = (
        Index("ix_alerts_device_id", "device_id"),
        Index("ix_alerts_status", "status"),
        Index("ix_alerts_severity", "severity"),
    )
