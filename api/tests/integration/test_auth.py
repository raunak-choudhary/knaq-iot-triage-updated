"""Integration tests for authentication."""
from tests.conftest import auth_headers


def test_no_auth_header_returns_401(client):
    response = client.get("/alerts")
    assert response.status_code == 401


def test_invalid_token_returns_401(client, seeded_devices):
    response = client.get("/alerts", headers=auth_headers("invalid-token-xyz"))
    assert response.status_code == 401


def test_missing_bearer_prefix_returns_401(client, seeded_devices):
    response = client.get("/alerts", headers={"Authorization": "token-alice-brookfield"})
    assert response.status_code == 401


def test_valid_token_returns_200(client, seeded_users, seeded_devices):
    response = client.get("/alerts", headers=auth_headers("token-alice-brookfield"))
    assert response.status_code == 200


def test_valid_token_users_endpoint(client, seeded_users, seeded_devices):
    response = client.get("/users", headers=auth_headers("token-carol-hines"))
    assert response.status_code == 200
    data = response.json()
    # All returned users should be from Hines
    for user in data:
        assert user["company"] == "Hines"
