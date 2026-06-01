FROM python:3.12-slim

# System timezone data is present on this image; tzdata PyPI package not needed on Linux
WORKDIR /app

# Install dependencies first (layer-cached)
COPY api/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY api/alembic/ ./alembic/
COPY api/alembic.ini ./
COPY api/app/ ./app/
COPY api/scripts/ ./scripts/

# Copy data directory — devices.json + sensor_messages.json needed at startup for ingest
COPY data/ ./data/

# Expose the API port
EXPOSE 8000

# The app auto-runs Alembic migrations, seeds users, and ingests data on startup via lifespan
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
