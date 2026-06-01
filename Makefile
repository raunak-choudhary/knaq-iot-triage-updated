.PHONY: api-install api-dev api-test api-test-unit api-test-int api-lint api-typecheck api-migrate \
        web-install web-dev web-test web-test-watch web-lint web-typecheck web-build \
        install test dev docker-up

# ─── Backend ────────────────────────────────────────────────────────────────
# All backend targets assume you have already activated api/.venv:
#   Windows:  api\.venv\Scripts\Activate.ps1
#   macOS/Linux: source api/.venv/bin/activate

PYTHON := api/.venv/Scripts/python
PYTEST  := $(PYTHON) -m pytest

# If on macOS/Linux the Scripts directory is bin — override:
#   make api-test PYTHON=api/.venv/bin/python

api-install:
	cd api && pip install -r requirements.txt -r requirements-dev.txt

api-dev:
	cd api && uvicorn app.main:app --reload --port 8000

api-test:
	cd api && $(PYTEST) tests/ -v --cov=app

api-test-unit:
	cd api && $(PYTEST) tests/unit/ -v

api-test-int:
	cd api && $(PYTEST) tests/integration/ -v

api-lint:
	cd api && $(PYTHON) -m ruff check app/ tests/

api-typecheck:
	cd api && $(PYTHON) -m mypy app/

api-migrate:
	cd api && $(PYTHON) -m alembic upgrade head

# ─── Frontend ───────────────────────────────────────────────────────────────

web-install:
	cd web && npm install

web-dev:
	cd web && npm run dev

web-test:
	cd web && npm test -- --watchAll=false

web-test-watch:
	cd web && npm test

web-lint:
	cd web && npm run lint

web-typecheck:
	cd web && npx tsc --noEmit

web-build:
	cd web && npm run build

# ─── Combined ───────────────────────────────────────────────────────────────

install: api-install web-install

test: api-test web-test

# Start both services concurrently (requires a POSIX shell or Git Bash on Windows)
dev:
	$(MAKE) api-dev &
	$(MAKE) web-dev

# ─── Docker ─────────────────────────────────────────────────────────────────

docker-up:
	docker compose up --build
