from sqlalchemy import BigInteger, ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class AlertTimeline(Base):
    __tablename__ = "alert_timeline"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    alert_id: Mapped[str] = mapped_column(
        String, ForeignKey("alerts.id", ondelete="CASCADE"), nullable=False
    )
    timestamp: Mapped[int] = mapped_column(BigInteger, nullable=False)
    action: Mapped[str] = mapped_column(String, nullable=False)
    user_name: Mapped[str | None] = mapped_column(String, nullable=True)
    details: Mapped[str | None] = mapped_column(String, nullable=True)
    note: Mapped[str | None] = mapped_column(String, nullable=True)

    __table_args__ = (Index("ix_alert_timeline_alert_id_timestamp", "alert_id", "timestamp"),)
