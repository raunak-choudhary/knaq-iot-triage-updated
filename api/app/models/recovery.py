from sqlalchemy import BigInteger, Boolean, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Recovery(Base):
    __tablename__ = "recoveries"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    device_id: Mapped[str] = mapped_column(String, ForeignKey("devices.device_id"), nullable=False)
    alert_type: Mapped[str] = mapped_column(String, nullable=False)
    severity: Mapped[str | None] = mapped_column(String, nullable=True)
    timestamp_utc: Mapped[int] = mapped_column(BigInteger, nullable=False)
    reading_value: Mapped[float | None] = mapped_column(Float, nullable=True)
    reading_name: Mapped[str | None] = mapped_column(String, nullable=True)
    is_duplicate: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
