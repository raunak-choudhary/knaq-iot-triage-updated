"""Tests for alert status transition enforcement."""
import uuid
from dataclasses import dataclass

import pytest

from app.exceptions import TransitionError


@dataclass
class FakeAlert:
    """Minimal alert-like object for testing transitions without DB."""
    id: str
    status: str
    device_id: str = "TEST-001"


def _make_alert_obj(status: str) -> FakeAlert:
    """Create a minimal alert-like object (not persisted)."""
    return FakeAlert(id=uuid.uuid4().hex, status=status)


class _FakeService:
    """Minimal AlertService-like object to test _enforce_transition."""

    def _enforce_transition(self, alert: FakeAlert, allowed: list[str], action: str) -> None:
        if alert.status not in allowed:
            raise TransitionError(
                detail=f"Cannot {action} an alert with status '{alert.status}'."
            )


svc = _FakeService()


def test_valid_new_to_acknowledged():
    alert = _make_alert_obj("new")
    svc._enforce_transition(alert, ["new"], "acknowledge")  # should not raise


def test_invalid_already_acknowledged():
    alert = _make_alert_obj("acknowledged")
    with pytest.raises(TransitionError) as exc_info:
        svc._enforce_transition(alert, ["new"], "acknowledge")
    assert "acknowledged" in exc_info.value.detail
    assert exc_info.value.status_code == 409


def test_invalid_resolve_from_new():
    alert = _make_alert_obj("new")
    with pytest.raises(TransitionError) as exc_info:
        svc._enforce_transition(alert, ["acknowledged"], "resolve")
    assert "new" in exc_info.value.detail
    assert exc_info.value.status_code == 409


def test_valid_acknowledged_to_resolved():
    alert = _make_alert_obj("acknowledged")
    svc._enforce_transition(alert, ["acknowledged"], "resolve")  # should not raise


def test_invalid_resolve_already_resolved():
    alert = _make_alert_obj("resolved")
    with pytest.raises(TransitionError) as exc_info:
        svc._enforce_transition(alert, ["acknowledged"], "resolve")
    assert "resolved" in exc_info.value.detail


def test_invalid_assign_on_resolved():
    alert = _make_alert_obj("resolved")
    with pytest.raises(TransitionError) as exc_info:
        svc._enforce_transition(alert, ["new", "acknowledged"], "assign")
    assert "resolved" in exc_info.value.detail
    assert exc_info.value.status_code == 409


def test_valid_assign_on_new():
    alert = _make_alert_obj("new")
    svc._enforce_transition(alert, ["new", "acknowledged"], "assign")  # should not raise


def test_valid_assign_on_acknowledged():
    alert = _make_alert_obj("acknowledged")
    svc._enforce_transition(alert, ["new", "acknowledged"], "assign")  # should not raise


def test_invalid_dismiss_on_resolved():
    alert = _make_alert_obj("resolved")
    with pytest.raises(TransitionError) as exc_info:
        svc._enforce_transition(alert, ["new", "acknowledged"], "dismiss")
    assert "resolved" in exc_info.value.detail


def test_valid_dismiss_on_new():
    alert = _make_alert_obj("new")
    svc._enforce_transition(alert, ["new", "acknowledged"], "dismiss")  # should not raise


def test_valid_reopen_on_resolved():
    alert = _make_alert_obj("resolved")
    svc._enforce_transition(alert, ["resolved", "dismissed"], "reopen")  # should not raise


def test_valid_reopen_on_dismissed():
    alert = _make_alert_obj("dismissed")
    svc._enforce_transition(alert, ["resolved", "dismissed"], "reopen")  # should not raise


def test_invalid_reopen_on_new():
    alert = _make_alert_obj("new")
    with pytest.raises(TransitionError) as exc_info:
        svc._enforce_transition(alert, ["resolved", "dismissed"], "reopen")
    assert "new" in exc_info.value.detail


def test_409_message_names_current_status():
    """Error message must include the current status name."""
    for status in ["new", "acknowledged", "resolved", "dismissed"]:
        alert = _make_alert_obj(status)
        disallowed_statuses_for_resolve = [s for s in ["new", "acknowledged", "resolved", "dismissed"] if s != status]
        try:
            svc._enforce_transition(alert, [disallowed_statuses_for_resolve[0]], "test_action")
        except TransitionError as exc:
            assert status in exc.detail, f"Status '{status}' not in error detail: {exc.detail}"
