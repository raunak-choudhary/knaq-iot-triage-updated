from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from alembic import command as alembic_command
from alembic.config import Config as AlembicConfig
from app.config import settings
from app.database import SessionLocal, check_db
from app.middleware.logging import LoggingMiddleware
from app.middleware.request_id import RequestIDMiddleware
from app.routers import alerts, devices, users
from app.schemas.common import HealthResponse

logger = structlog.get_logger()


def _run_migrations() -> None:
    from pathlib import Path

    alembic_ini = Path(__file__).parent.parent / "alembic.ini"
    cfg = AlembicConfig(str(alembic_ini))
    alembic_command.upgrade(cfg, "head")


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        _run_migrations()
        logger.info("migrations_complete")
    except Exception as exc:
        logger.error("migration_error", error=str(exc))

    try:
        from scripts.seed_users import seed_users

        db = SessionLocal()
        try:
            seed_users(db)
        finally:
            db.close()
        logger.info("seed_users_complete")
    except Exception as exc:
        logger.error("seed_users_error", error=str(exc))

    try:
        from app.services.ingest_service import run_ingest

        db = SessionLocal()
        try:
            counts = run_ingest(db)
            logger.info(
                "ingest_summary",
                readings=counts["readings"],
                alerts=counts["alerts"],
                recoveries=counts["recoveries"],
                malformed=counts["malformed"],
            )
        finally:
            db.close()
    except Exception as exc:
        logger.error("ingest_error", error=str(exc))

    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title="Knaq IoT Alert Triage API",
        version="1.0.0",
        lifespan=lifespan,
    )

    app.add_middleware(LoggingMiddleware)
    app.add_middleware(RequestIDMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(alerts.router)
    app.include_router(devices.router)
    app.include_router(users.router)

    @app.get("/health", response_model=HealthResponse)
    def health() -> HealthResponse:
        db_ok = check_db()
        return HealthResponse(status="ok", db="ok" if db_ok else "error")

    return app


app = create_app()
