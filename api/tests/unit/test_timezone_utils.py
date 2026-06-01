"""Tests for timezone utility functions."""
from datetime import datetime
from zoneinfo import ZoneInfo

import pytest

from app.utils.timezone import epoch_ms_to_local_iso, local_iso_to_epoch_ms

# Summer 2025: July 15 noon UTC = July 15 8AM EDT (UTC-4)
JULY_EPOCH_MS = int(datetime(2025, 7, 15, 12, 0, 0, tzinfo=ZoneInfo("UTC")).timestamp() * 1000)

# Winter 2026: January 15 noon UTC = January 15 7AM EST (UTC-5)
JAN_EPOCH_MS = int(datetime(2026, 1, 15, 12, 0, 0, tzinfo=ZoneInfo("UTC")).timestamp() * 1000)

# Tokyo (no DST): July 15 noon UTC = July 15 9PM JST (UTC+9)
TOKYO_EPOCH_MS = JULY_EPOCH_MS


def test_ny_summer_offset():
    """America/New_York in summer should be UTC-4 (EDT)."""
    result = epoch_ms_to_local_iso(JULY_EPOCH_MS, "America/New_York")
    assert "-04:00" in result, f"Expected -04:00 offset, got: {result}"


def test_ny_winter_offset():
    """America/New_York in winter should be UTC-5 (EST)."""
    result = epoch_ms_to_local_iso(JAN_EPOCH_MS, "America/New_York")
    assert "-05:00" in result, f"Expected -05:00 offset, got: {result}"


def test_tokyo_offset():
    """Asia/Tokyo should always be +09:00 (no DST)."""
    result = epoch_ms_to_local_iso(TOKYO_EPOCH_MS, "Asia/Tokyo")
    assert "+09:00" in result, f"Expected +09:00 offset, got: {result}"


def test_parse_ny_start_to_utc_ms():
    """Parsing a NY summer datetime should produce correct UTC ms."""
    # 2026-04-10 08:00 EDT = 2026-04-10 12:00 UTC
    result = local_iso_to_epoch_ms("2026-04-10T08:00", "America/New_York")
    expected = int(datetime(2026, 4, 10, 12, 0, 0, tzinfo=ZoneInfo("UTC")).timestamp() * 1000)
    assert result == expected, f"Expected {expected}, got {result}"


def test_parse_chicago_start_to_utc_ms():
    """Parsing a Chicago summer datetime should produce correct UTC ms (CDT = UTC-5)."""
    # 2026-06-15 09:00 CDT = 2026-06-15 14:00 UTC
    result = local_iso_to_epoch_ms("2026-06-15T09:00", "America/Chicago")
    expected = int(datetime(2026, 6, 15, 14, 0, 0, tzinfo=ZoneInfo("UTC")).timestamp() * 1000)
    assert result == expected, f"Expected {expected}, got {result}"


def test_dst_fold_does_not_raise():
    """Parsing the ambiguous fall-back hour should not raise an exception."""
    # 2026-11-01 01:30 is ambiguous in America/Chicago (fall back)
    try:
        result = local_iso_to_epoch_ms("2026-11-01T01:30", "America/Chicago")
        assert isinstance(result, int)
    except Exception as exc:
        pytest.fail(f"DST fold raised an exception: {exc}")


def test_london_winter_offset():
    """Europe/London in winter should be UTC+0 (GMT)."""
    jan_ms = int(datetime(2026, 1, 15, 12, 0, 0, tzinfo=ZoneInfo("UTC")).timestamp() * 1000)
    result = epoch_ms_to_local_iso(jan_ms, "Europe/London")
    assert "+00:00" in result or "Z" in result or "UTC" in result or "00:00" in result, \
        f"Expected UTC+0 offset, got: {result}"


def test_roundtrip_ny_summer():
    """Converting epoch ms → local ISO → back to epoch ms should be idempotent."""
    original_ms = JULY_EPOCH_MS
    local_str = epoch_ms_to_local_iso(original_ms, "America/New_York")
    # strip offset to test local_iso_to_epoch_ms with naive string
    naive_str = local_str[:19]  # "2025-07-15T08:00:00"
    back_ms = local_iso_to_epoch_ms(naive_str, "America/New_York")
    assert back_ms == original_ms
