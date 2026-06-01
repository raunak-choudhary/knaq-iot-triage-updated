from sqlalchemy.orm import Session

from app.models.device import Device
from app.repositories.base import BaseRepository


class DeviceRepository(BaseRepository):
    def __init__(self, db: Session):
        super().__init__(db)

    def get_all_as_dict(self) -> dict[str, Device]:
        devices = self.db.query(Device).all()
        return {d.device_id: d for d in devices}

    def list_by_company(self, company: str) -> list[Device]:
        return self.db.query(Device).filter(Device.company == company).all()

    def get_by_id_and_company(self, device_id: str, company: str) -> Device | None:
        return (
            self.db.query(Device)
            .filter(Device.device_id == device_id, Device.company == company)
            .first()
        )
