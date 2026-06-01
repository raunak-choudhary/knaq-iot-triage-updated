"""Integration tests for device endpoints."""
from datetime import datetime
from zoneinfo import ZoneInfo

import pytest

from app.models.sensor_reading import SensorReading
from tests.conftest import auth_headers
from tests.factories.device_factory import make_device

# July 15 2025 noon UTC  (EDT = UTC-4)
JULY_EPOCH_MS = int(datetime(2025, 7, 15, 12, 0, 0, tzinfo=ZoneInfo("UTC")).timestamp() * 1000)


@pytest.fixture
def ny_device(db, seeded_users):
    return make_device(
        db,
        device_id="NY-001",
        company="Brookfield Properties",
        name="New York Elevator",
        timezone="America/New_York",
        reading_types=["current"],
        alert_thresholds={"current_high": 180.0},
    )


def test_list_devices_brookfield(client, seeded_users, seeded_devices):
    response = client.get("/devices", headers=auth_headers("token-alice-brookfield"))
    assert response.status_code == 200
    data = response.json()
    # Brookfield has 4 devices
    assert len(data) == 4
    for d in data:
        assert d["company"] == "Brookfield Properties"


def test_get_device_own_company(client, seeded_users, seeded_devices):
    response = client.get("/devices/ELV-001", headers=auth_headers("token-alice-brookfield"))
    assert response.status_code == 200
    data = response.json()
    assert data["device_id"] == "ELV-001"


def test_get_device_cross_company_returns_404(client, seeded_users, seeded_devices):
    # ELV-003 is Hines, not Brookfield
    response = client.get("/devices/ELV-003", headers=auth_headers("token-alice-brookfield"))
    assert response.status_code == 404


def test_readings_missing_start_returns_422(client, seeded_users, seeded_devices):
    response = client.get(
        "/devices/ELV-001/readings?end=2025-07-15T12:00",
        headers=auth_headers("token-alice-brookfield")
    )
    assert response.status_code == 422


def test_readings_missing_end_returns_422(client, seeded_users, seeded_devices):
    response = client.get(
        "/devices/ELV-001/readings?start=2025-07-15T08:00",
        headers=auth_headers("token-alice-brookfield")
    )
    assert response.status_code == 422


def test_readings_tz_offset_correct(client, db, ny_device):
    # Insert a reading at July 15 noon UTC (should be 8:00 AM EDT -04:00)
    reading = SensorReading(
        device_id="NY-001",
        timestamp_utc=JULY_EPOCH_MS,
        reading_name="current",
        reading_value=50.0,
        breaches_threshold=False,
        is_duplicate=False,
    )
    db.add(reading)
    db.commit()

    # Query for readings (local time in NY: 8:00 AM, but we ask for a window)
    response = client.get(
        "/devices/NY-001/readings?start=2025-07-15T07:00&end=2025-07-15T09:00",
        headers=auth_headers("token-alice-brookfield")
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    # timestamp_local should have -04:00 (EDT)
    assert "-04:00" in data[0]["timestamp_local"], \
        f"Expected -04:00 in timestamp_local, got: {data[0]['timestamp_local']}"


def test_readings_duplicates_excluded(client, db, ny_device):
    # Insert a normal reading and a duplicate
    reading1 = SensorReading(
        device_id="NY-001",
        timestamp_utc=JULY_EPOCH_MS,
        reading_name="current",
        reading_value=50.0,
        breaches_threshold=False,
        is_duplicate=False,
    )
    reading2 = SensorReading(
        device_id="NY-001",
        timestamp_utc=JULY_EPOCH_MS,
        reading_name="current",
        reading_value=50.0,
        breaches_threshold=False,
        is_duplicate=True,
    )
    db.add(reading1)
    db.add(reading2)
    db.commit()

    response = client.get(
        "/devices/NY-001/readings?start=2025-07-15T07:00&end=2025-07-15T09:00",
        headers=auth_headers("token-alice-brookfield")
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1  # only non-duplicate


def test_readings_cross_company_device_returns_404(client, seeded_users, seeded_devices):
    response = client.get(
        "/devices/ELV-003/readings?start=2025-07-15T07:00&end=2025-07-15T09:00",
        headers=auth_headers("token-alice-brookfield")
    )
    assert response.status_code == 404
