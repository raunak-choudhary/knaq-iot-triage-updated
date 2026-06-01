from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.exceptions import NotFoundError
from app.models.sensor_reading import SensorReading
from app.models.user import User
from app.repositories.device_repository import DeviceRepository
from app.schemas.device import DeviceResponse, ReadingResponse
from app.utils.timezone import epoch_ms_to_local_iso, local_iso_to_epoch_ms

router = APIRouter(prefix="/devices", tags=["devices"])


@router.get("", response_model=list[DeviceResponse])
def list_devices(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[DeviceResponse]:
    repo = DeviceRepository(db)
    devices = repo.list_by_company(current_user.company)
    return [DeviceResponse.model_validate(d) for d in devices]


@router.get("/{device_id}", response_model=DeviceResponse)
def get_device(
    device_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DeviceResponse:
    repo = DeviceRepository(db)
    device = repo.get_by_id_and_company(device_id, current_user.company)
    if device is None:
        raise NotFoundError(detail=f"Device '{device_id}' not found.")
    return DeviceResponse.model_validate(device)


@router.get("/{device_id}/readings", response_model=list[ReadingResponse])
def get_readings(
    device_id: str,
    start: str = Query(...),
    end: str = Query(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[ReadingResponse]:
    repo = DeviceRepository(db)
    device = repo.get_by_id_and_company(device_id, current_user.company)
    if device is None:
        raise NotFoundError(detail=f"Device '{device_id}' not found.")

    start_ms = local_iso_to_epoch_ms(start, device.timezone)
    end_ms = local_iso_to_epoch_ms(end, device.timezone)

    readings = (
        db.query(SensorReading)
        .filter(
            SensorReading.device_id == device_id,
            SensorReading.timestamp_utc >= start_ms,
            SensorReading.timestamp_utc <= end_ms,
            SensorReading.is_duplicate.is_(False),
        )
        .order_by(SensorReading.timestamp_utc.asc())
        .all()
    )

    return [
        ReadingResponse(
            id=r.id,
            device_id=r.device_id,
            timestamp_utc=r.timestamp_utc,
            timestamp_local=epoch_ms_to_local_iso(r.timestamp_utc, device.timezone),
            reading_name=r.reading_name,
            reading_value=r.reading_value,
            breaches_threshold=r.breaches_threshold,
            is_anomaly=r.is_anomaly,
        )
        for r in readings
    ]
