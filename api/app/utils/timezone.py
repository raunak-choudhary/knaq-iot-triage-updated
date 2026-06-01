from datetime import datetime
from zoneinfo import ZoneInfo


def epoch_ms_to_local_iso(timestamp_ms: int, timezone: str) -> str:
    """Convert epoch milliseconds to ISO 8601 string with UTC offset in local timezone."""
    tz = ZoneInfo(timezone)
    dt = datetime.fromtimestamp(timestamp_ms / 1000.0, tz=tz)
    return dt.isoformat()


def local_iso_to_epoch_ms(local_iso: str, timezone: str) -> int:
    """Parse a naive local ISO 8601 datetime string and convert to epoch milliseconds."""
    tz = ZoneInfo(timezone)
    dt = datetime.fromisoformat(local_iso).replace(tzinfo=tz)
    return int(dt.timestamp() * 1000)
