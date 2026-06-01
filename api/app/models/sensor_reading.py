from typing import Any

from sqlalchemy import JSON, BigInteger, Boolean, Float, ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    device_id: Mapped[str] = mapped_column(String, ForeignKey("devices.device_id"), nullable=False)
    timestamp_utc: Mapped[int] = mapped_column(BigInteger, nullable=False)
    reading_name: Mapped[str] = mapped_column(String, nullable=False)
    reading_value: Mapped[float] = mapped_column(Float, nullable=False)
    breaches_threshold: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    is_duplicate: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    is_anomaly: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    raw_json: Mapped[Any] = mapped_column(JSON, nullable=True)

    __table_args__ = (
        Index("ix_sensor_readings_device_id_timestamp_utc", "device_id", "timestamp_utc"),
    )
