# Backend — Knaq IoT Alert Triage

FastAPI backend for the Knaq IoT Alert Triage system.

For complete setup instructions, see the [root README](../README.md).

---

## Quick Start

```bash
cd api
python3.12 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\Activate.ps1
pip install -r requirements.txt -r requirements-dev.txt
cp .env.local.example .env
uvicorn app.main:app --port 8000
```

- Swagger UI: http://localhost:8000/docs
- Health check: http://localhost:8000/health

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `sqlite:///./knaq.db` | SQLAlchemy connection string. Change to a PostgreSQL DSN for production. |
| `CORS_ORIGINS` | `https://knaq-iot-triage-web.onrender.com` in `.env.example`, `http://localhost:3000` in `.env.local.example` | Comma-separated list of allowed CORS origins. |
| `LOG_LEVEL` | `INFO` | Structlog log level. |

Use `.env.example` for hosted Render deployment values and `.env.local.example` for local development.

---

## Live Deployment

- Health: https://knaq-iot-triage-api.onrender.com/health
- Swagger UI: https://knaq-iot-triage-api.onrender.com/docs

Render settings used for the demo:

| Setting | Value |
|---|---|
| Runtime | `Python 3` |
| Build command | `pip install -r api/requirements.txt` |
| Start command | `cd api && uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Instance type | Free |

Required environment variables:

```text
DATABASE_URL=sqlite:///./knaq.db
CORS_ORIGINS=https://knaq-iot-triage-web.onrender.com
LOG_LEVEL=INFO
PYTHON_VERSION=3.12.9
```

---

## Startup Sequence

On every startup, the application automatically runs these steps in order:

1. **Alembic migrations** (`alembic upgrade head`) -- applies any pending schema migrations.
2. **User seeding** -- inserts 6 users across 3 companies if they do not exist yet (idempotent).
3. **Message ingest** -- reads `data/sensor_messages.json`, validates and stores all messages, then runs anomaly detection. The entire process is idempotent and safe to re-run.

You should see structured log lines for `migrations_complete`, `seed_users_complete`, and `ingest_complete` (with reading, alert, recovery, malformed, and anomaly counts).

---

## Source Structure

```
app/
  main.py               App factory, lifespan hook, CORS, router registration
  config.py             Pydantic Settings for environment variables
  database.py           SQLAlchemy engine, session, WAL mode setup
  exceptions.py         Custom HTTP exception classes (NotFoundError, TransitionError, AuthError)

  middleware/
    request_id.py       Injects X-Request-ID header on every request
    logging.py          Structured JSON request log per request

  models/               SQLAlchemy ORM models (one file per table)
    device.py
    alert.py
    alert_timeline.py
    sensor_reading.py
    recovery.py
    user.py

  schemas/              Pydantic request and response models
    alert.py            AlertListItem, AlertResponse, PaginatedAlertsResponse,
                        AlertStatsResponse, mutation request bodies, BulkOperationResult
    device.py           DeviceResponse, ReadingResponse
    user.py             UserResponse
    common.py           StatusCounts, HealthResponse

  repositories/         Data access layer (SQL queries only, no business logic)
    base.py             Shared base class
    alert_repository.py list_by_company, get_by_id_and_company, get_timeline
    device_repository.py
    user_repository.py

  services/             Business logic layer
    ingest_service.py   Parse, validate, deduplicate, store, anomaly detection
    alert_service.py    Triage mutations and transition enforcement
    auth_service.py     Token-to-user resolution

  routers/              Thin HTTP handlers (delegates to services)
    alerts.py           All alert endpoints including bulk and stats
    devices.py          Device list, detail, and readings
    users.py            User list

  dependencies/
    auth.py             get_current_user FastAPI dependency

  utils/
    timezone.py         epoch_ms_to_local_iso and local_iso_to_epoch_ms

alembic/                Database migrations
  versions/
    f4b35149657d_initial_schema.py
    12dbb393bbb6_add_is_anomaly_to_sensor_readings.py

scripts/
  seed_users.py         Standalone script for idempotent user seeding
```

---

## Running Tests

With the virtual environment active:

```bash
pytest -q
```

Expected: **99 tests pass**.

To see coverage:

```bash
pytest --cov=app --cov-report=term-missing -q
```

**Test structure:**

```
tests/
  unit/
    test_transition_rules.py    State machine exhaustive coverage
    test_timezone_utils.py      Timezone conversion correctness and DST edge cases
    test_ingest_service.py      Parse, validate, dedup, malformed handling
    test_alert_service.py       All 4 mutations and 409 paths

  integration/
    test_health.py              Health endpoint
    test_auth.py                401 paths and token resolution
    test_alerts_read.py         GET endpoints with company scoping and filters
    test_alerts_mutations.py    Full workflow and invalid transition enforcement
    test_devices_api.py         Timezone-correct readings endpoint
    test_ingest.py              Full ingest with provided dataset, idempotency

  factories/                   Plain Python test data builders
    alert_factory.py
    device_factory.py
    user_factory.py
```

---

## Linting and Type Checking

```bash
ruff check app/ tests/
mypy app/
```

---

## Adding a Database Migration

After modifying any model file:

```bash
alembic revision --autogenerate -m "describe_your_change"
alembic upgrade head
```

Review the generated migration in `alembic/versions/` before applying. For SQLite compatibility, ensure any `NOT NULL` column addition includes `server_default`.
