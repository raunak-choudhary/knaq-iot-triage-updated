from typing import Any

from sqlalchemy import JSON, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Device(Base):
    __tablename__ = "devices"

    device_id: Mapped[str] = mapped_column(String, primary_key=True)
    type: Mapped[str] = mapped_column(String, nullable=False)
    company: Mapped[str] = mapped_column(String, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    location: Mapped[str] = mapped_column(String, nullable=False)
    timezone: Mapped[str] = mapped_column(String, nullable=False)
    floor_count: Mapped[int | None] = mapped_column(nullable=True)
    installed_date: Mapped[str] = mapped_column(String, nullable=False)
    reading_types: Mapped[list[Any]] = mapped_column(JSON, nullable=False, default=list)
    alert_thresholds: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False, default=dict)
