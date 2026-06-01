# Graph Report - .  (2026-05-31)

## Corpus Check
- 149 files · ~41,890 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 761 nodes · 1384 edges · 45 communities detected
- Extraction: 70% EXTRACTED · 30% INFERRED · 0% AMBIGUOUS · INFERRED: 410 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Alert Triage Core|Alert Triage Core]]
- [[_COMMUNITY_Ingest Pipeline|Ingest Pipeline]]
- [[_COMMUNITY_API Routing Layer|API Routing Layer]]
- [[_COMMUNITY_Frontend Components|Frontend Components]]
- [[_COMMUNITY_RTK Query and State|RTK Query and State]]
- [[_COMMUNITY_Auth and Multi-Tenancy|Auth and Multi-Tenancy]]
- [[_COMMUNITY_Data Models and Schema|Data Models and Schema]]
- [[_COMMUNITY_Test Infrastructure|Test Infrastructure]]
- [[_COMMUNITY_Timezone and Utilities|Timezone and Utilities]]
- [[_COMMUNITY_DevOps and Config|DevOps and Config]]
- [[_COMMUNITY_Analytics Dashboard|Analytics Dashboard]]
- [[_COMMUNITY_Bulk Actions and Shortcuts|Bulk Actions and Shortcuts]]
- [[_COMMUNITY_Architecture Decisions|Architecture Decisions]]
- [[_COMMUNITY_Module Group 13|Module Group 13]]
- [[_COMMUNITY_Module Group 14|Module Group 14]]
- [[_COMMUNITY_Module Group 15|Module Group 15]]
- [[_COMMUNITY_Module Group 16|Module Group 16]]
- [[_COMMUNITY_Module Group 17|Module Group 17]]
- [[_COMMUNITY_Module Group 18|Module Group 18]]
- [[_COMMUNITY_Module Group 19|Module Group 19]]
- [[_COMMUNITY_Module Group 20|Module Group 20]]
- [[_COMMUNITY_Module Group 21|Module Group 21]]
- [[_COMMUNITY_Module Group 22|Module Group 22]]
- [[_COMMUNITY_Module Group 23|Module Group 23]]
- [[_COMMUNITY_Module Group 24|Module Group 24]]
- [[_COMMUNITY_Module Group 25|Module Group 25]]
- [[_COMMUNITY_Module Group 26|Module Group 26]]
- [[_COMMUNITY_Module Group 27|Module Group 27]]
- [[_COMMUNITY_Module Group 28|Module Group 28]]
- [[_COMMUNITY_Module Group 29|Module Group 29]]
- [[_COMMUNITY_Module Group 30|Module Group 30]]
- [[_COMMUNITY_Module Group 31|Module Group 31]]
- [[_COMMUNITY_Module Group 32|Module Group 32]]
- [[_COMMUNITY_Module Group 33|Module Group 33]]
- [[_COMMUNITY_Module Group 34|Module Group 34]]
- [[_COMMUNITY_Module Group 35|Module Group 35]]
- [[_COMMUNITY_Module Group 36|Module Group 36]]
- [[_COMMUNITY_Module Group 37|Module Group 37]]
- [[_COMMUNITY_Module Group 38|Module Group 38]]
- [[_COMMUNITY_Module Group 39|Module Group 39]]
- [[_COMMUNITY_Module Group 40|Module Group 40]]
- [[_COMMUNITY_Module Group 41|Module Group 41]]
- [[_COMMUNITY_Module Group 42|Module Group 42]]
- [[_COMMUNITY_Module Group 43|Module Group 43]]
- [[_COMMUNITY_Module Group 158|Module Group 158]]

## God Nodes (most connected - your core abstractions)
1. `AlertService` - 53 edges
2. `SQLAlchemy 2.x ORM` - 47 edges
3. `make_alert()` - 41 edges
4. `auth_headers()` - 38 edges
5. `run_ingest()` - 35 edges
6. `FastAPI Backend Service (api/)` - 29 edges
7. `AlertTimeline` - 27 edges
8. `Next.js Frontend Service (web/)` - 23 edges
9. `Full-Stack Implementation Plan (2026-05-30-001)` - 21 edges
10. `SensorReading` - 20 edges

## Surprising Connections (you probably didn't know these)
- `Next.js 14 Frontend` --includes_asset--> `file.svg (public asset)`  [INFERRED]
  /Users/raunakchoudhary/Data/Projects/knaq-iot-triage/docs/plans/2026-05-30-001-feat-knaq-iot-triage-system-plan.md → /Users/raunakchoudhary/Data/Projects/knaq-iot-triage/web/public/file.svg
- `Next.js 14 Frontend` --includes_asset--> `vercel.svg (public asset)`  [INFERRED]
  /Users/raunakchoudhary/Data/Projects/knaq-iot-triage/docs/plans/2026-05-30-001-feat-knaq-iot-triage-system-plan.md → /Users/raunakchoudhary/Data/Projects/knaq-iot-triage/web/public/vercel.svg
- `Next.js 14 Frontend` --includes_asset--> `next.svg (public asset)`  [INFERRED]
  /Users/raunakchoudhary/Data/Projects/knaq-iot-triage/docs/plans/2026-05-30-001-feat-knaq-iot-triage-system-plan.md → /Users/raunakchoudhary/Data/Projects/knaq-iot-triage/web/public/next.svg
- `Next.js 14 Frontend` --includes_asset--> `globe.svg (public asset)`  [INFERRED]
  /Users/raunakchoudhary/Data/Projects/knaq-iot-triage/docs/plans/2026-05-30-001-feat-knaq-iot-triage-system-plan.md → /Users/raunakchoudhary/Data/Projects/knaq-iot-triage/web/public/globe.svg
- `Next.js 14 Frontend` --includes_asset--> `window.svg (public asset)`  [INFERRED]
  /Users/raunakchoudhary/Data/Projects/knaq-iot-triage/docs/plans/2026-05-30-001-feat-knaq-iot-triage-system-plan.md → /Users/raunakchoudhary/Data/Projects/knaq-iot-triage/web/public/window.svg

## Communities

### Community 0 - "Alert Triage Core"
Cohesion: 0.04
Nodes (34): AlertRepository, get_alert(), get_current_user(), AuthService, Base, BaseRepository, BaseRepository, client() (+26 more)

### Community 1 - "Ingest Pipeline"
Cohesion: 0.04
Nodes (57): AlertRepository (alert_repository.py), AlertService (alert_service.py), Alerts Router (routers/alerts.py), Anomaly Detection (Z-Score), FastAPI Backend Service (api/), AuthService (auth_service.py), Backend Integration Tests, Backend Unit Tests (99 tests) (+49 more)

### Community 2 - "API Routing Layer"
Cohesion: 0.13
Nodes (39): AssignRequest, ResolveRequest, AlertService, _build_alert_response(), _now_ms(), AlertTimeline, acknowledge_alert(), add_note() (+31 more)

### Community 3 - "Frontend Components"
Cohesion: 0.06
Nodes (53): Mutation: acknowledge, Alembic Database Migrations, Alert Status: acknowledged, Alert Status: dismissed (bonus), Alert Status: new, Alert Status: resolved, alert_timeline DB Table (append-only), Mutation: assign (+45 more)

### Community 4 - "RTK Query and State"
Cohesion: 0.12
Nodes (40): make_alert(), auth_headers(), _get_user_id(), Integration tests for alert mutation endpoints., Hines user cannot be assigned to Brookfield alert., Full workflow: new→acknowledge→assign→note→resolve = timeline 5 entries., setup(), test_acknowledge_already_acknowledged_returns_409() (+32 more)

### Community 5 - "Auth and Multi-Tenancy"
Cohesion: 0.11
Nodes (30): Alert, Recovery, SensorReading, ny_device(), Integration tests for device endpoints., test_get_device_cross_company_returns_404(), test_get_device_own_company(), test_list_devices_brookfield() (+22 more)

### Community 6 - "Data Models and Schema"
Cohesion: 0.16
Nodes (27): AuthError, KnaqException, NotFoundError, TransitionError, HTTPException, FakeAlert, _FakeService, _make_alert_obj() (+19 more)

### Community 7 - "Test Infrastructure"
Cohesion: 0.24
Nodes (26): _check_threshold(), _detect_anomalies(), _is_malformed(), _preload_dedup_keys(), Flag readings that are within threshold range but statistically unusual (|z| > 2, run_ingest(), _upsert_devices(), _make_device_json() (+18 more)

### Community 8 - "Timezone and Utilities"
Cohesion: 0.19
Nodes (20): AcknowledgeRequest, AlertListItem, AlertResponse, AlertStatsResponse, BulkAcknowledgeRequest, BulkAssignRequest, BulkOperationResult, DismissRequest (+12 more)

### Community 9 - "DevOps and Config"
Cohesion: 0.09
Nodes (28): Alert Detail Page (alerts/[id]/page.tsx), Alert Queue Page (alerts/page.tsx), AlertTable Component, AlertTimeline Component, Analytics Dashboard Page (analytics/page.tsx), AssignDialog Component, Dark and Light Theme with localStorage Persistence, Filters Redux Slice (filtersSlice.ts) (+20 more)

### Community 10 - "Analytics Dashboard"
Cohesion: 0.14
Nodes (21): Tests for timezone utility functions., America/New_York in summer should be UTC-4 (EDT)., America/New_York in winter should be UTC-5 (EST)., Asia/Tokyo should always be +09:00 (no DST)., Parsing a NY summer datetime should produce correct UTC ms., Parsing a Chicago summer datetime should produce correct UTC ms (CDT = UTC-5)., Parsing the ambiguous fall-back hour should not raise an exception., Europe/London in winter should be UTC+0 (GMT). (+13 more)

### Community 11 - "Bulk Actions and Shortcuts"
Cohesion: 0.16
Nodes (11): BaseHTTPMiddleware, LoggingMiddleware, handleDeviceChange(), handleKeyDown(), handleSeverityChange(), handleSortChange(), handleStatusClick(), toggleAll() (+3 more)

### Community 12 - "Architecture Decisions"
Cohesion: 0.2
Nodes (11): getInitials(), handleAcknowledge(), handleAddNote(), handleAssign(), handleDismiss(), handleReopen(), handleResolve(), getInitials() (+3 more)

### Community 13 - "Module Group 13"
Cohesion: 0.31
Nodes (6): downgrade(), initial_schema  Revision ID: f4b35149657d Revises:  Create Date: 2026-05-31 12:5, upgrade(), create_app(), lifespan(), _run_migrations()

### Community 14 - "Module Group 14"
Cohesion: 0.36
Nodes (4): getTheme(), AllProviders(), makeTestStore(), renderWithProviders()

### Community 15 - "Module Group 15"
Cohesion: 0.25
Nodes (1): BroadcastChannelPolyfill

### Community 16 - "Module Group 16"
Cohesion: 0.33
Nodes (3): Providers(), useColorMode(), ThemeToggle()

### Community 17 - "Module Group 17"
Cohesion: 0.4
Nodes (4): Run migrations in 'offline' mode., Run migrations in 'online' mode., run_migrations_offline(), run_migrations_online()

### Community 18 - "Module Group 18"
Cohesion: 0.5
Nodes (3): BaseSettings, cors_origins_list(), Settings

### Community 19 - "Module Group 19"
Cohesion: 0.6
Nodes (3): downgrade(), add_is_anomaly_to_sensor_readings  Revision ID: 12dbb393bbb6 Revises: f4b3514965, upgrade()

### Community 20 - "Module Group 20"
Cohesion: 0.5
Nodes (1): CustomJsdomEnvironment

### Community 21 - "Module Group 21"
Cohesion: 0.67
Nodes (2): makeAlert(), MockLink()

### Community 22 - "Module Group 22"
Cohesion: 0.67
Nodes (2): handleClose(), handleSelectChange()

### Community 23 - "Module Group 23"
Cohesion: 0.67
Nodes (2): createAuthBaseQuery(), prepareHeaders()

### Community 24 - "Module Group 24"
Cohesion: 0.67
Nodes (2): Integration tests for /health endpoint., test_health_ok()

### Community 25 - "Module Group 25"
Cohesion: 0.67
Nodes (2): getInitials(), makeSortHandler()

### Community 26 - "Module Group 26"
Cohesion: 0.67
Nodes (2): formatLocalDate(), formatRelativeTime()

### Community 27 - "Module Group 27"
Cohesion: 0.67
Nodes (1): config()

### Community 28 - "Module Group 28"
Cohesion: 0.67
Nodes (1): RootLayout()

### Community 29 - "Module Group 29"
Cohesion: 0.67
Nodes (1): Home()

### Community 30 - "Module Group 30"
Cohesion: 0.67
Nodes (1): NotFound()

### Community 31 - "Module Group 31"
Cohesion: 0.67
Nodes (1): AlertDetailPage()

### Community 32 - "Module Group 32"
Cohesion: 0.67
Nodes (1): fillRequiredFields()

### Community 33 - "Module Group 33"
Cohesion: 0.67
Nodes (1): humanizeDetails()

### Community 34 - "Module Group 34"
Cohesion: 0.67
Nodes (1): makeEntry()

### Community 35 - "Module Group 35"
Cohesion: 0.67
Nodes (1): resolve()

### Community 36 - "Module Group 36"
Cohesion: 0.67
Nodes (1): handleSubmit()

### Community 37 - "Module Group 37"
Cohesion: 0.67
Nodes (1): useAlertActions()

### Community 38 - "Module Group 38"
Cohesion: 0.67
Nodes (1): SeverityChip()

### Community 39 - "Module Group 39"
Cohesion: 0.67
Nodes (1): LoadingSkeleton()

### Community 40 - "Module Group 40"
Cohesion: 0.67
Nodes (1): StatusBadge()

### Community 41 - "Module Group 41"
Cohesion: 0.67
Nodes (1): MockLink()

### Community 42 - "Module Group 42"
Cohesion: 0.67
Nodes (1): MockLink()

### Community 43 - "Module Group 43"
Cohesion: 0.67
Nodes (1): resetAlertState()

### Community 158 - "Module Group 158"
Cohesion: 1.0
Nodes (1): Database Table: devices

## Knowledge Gaps
- **79 isolated node(s):** `Convert epoch milliseconds to ISO 8601 string with UTC offset in local timezone.`, `Parse a naive local ISO 8601 datetime string and convert to epoch milliseconds.`, `America/New_York in summer should be UTC-4 (EDT).`, `America/New_York in winter should be UTC-5 (EST).`, `Asia/Tokyo should always be +09:00 (no DST).` (+74 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Module Group 15`** (8 nodes): `BroadcastChannelPolyfill`, `.addEventListener()`, `.constructor()`, `.dispatchEvent()`, `.postMessage()`, `.removeEventListener()`, `jest.setup.ts`, `jest.setup.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module Group 20`** (4 nodes): `CustomJsdomEnvironment`, `.setup()`, `jest.environment.ts`, `jest.environment.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module Group 21`** (4 nodes): `makeAlert()`, `MockLink()`, `AlertTable.test.tsx`, `AlertTable.test.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module Group 22`** (4 nodes): `handleClose()`, `handleSelectChange()`, `ResolveDialog.tsx`, `ResolveDialog.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module Group 23`** (4 nodes): `createAuthBaseQuery()`, `prepareHeaders()`, `index.ts`, `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module Group 24`** (4 nodes): `test_health.py`, `Integration tests for /health endpoint.`, `test_health_ok()`, `test_health.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module Group 25`** (4 nodes): `getInitials()`, `makeSortHandler()`, `AlertTable.tsx`, `AlertTable.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module Group 26`** (4 nodes): `formatLocalDate()`, `formatRelativeTime()`, `formatters.ts`, `formatters.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module Group 27`** (3 nodes): `config()`, `jest.config.ts`, `jest.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module Group 28`** (3 nodes): `RootLayout()`, `layout.tsx`, `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module Group 29`** (3 nodes): `Home()`, `page.tsx`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module Group 30`** (3 nodes): `NotFound()`, `not-found.tsx`, `not-found.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module Group 31`** (3 nodes): `AlertDetailPage()`, `page.tsx`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module Group 32`** (3 nodes): `fillRequiredFields()`, `ResolveDialog.test.tsx`, `ResolveDialog.test.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module Group 33`** (3 nodes): `humanizeDetails()`, `AlertTimeline.tsx`, `AlertTimeline.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module Group 34`** (3 nodes): `makeEntry()`, `AlertTimeline.test.tsx`, `AlertTimeline.test.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module Group 35`** (3 nodes): `resolve()`, `AddNoteForm.test.tsx`, `AddNoteForm.test.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module Group 36`** (3 nodes): `handleSubmit()`, `AddNoteForm.tsx`, `AddNoteForm.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module Group 37`** (3 nodes): `useAlertActions()`, `useAlertActions.ts`, `useAlertActions.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module Group 38`** (3 nodes): `SeverityChip()`, `SeverityChip.tsx`, `SeverityChip.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module Group 39`** (3 nodes): `LoadingSkeleton()`, `LoadingSkeleton.tsx`, `LoadingSkeleton.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module Group 40`** (3 nodes): `StatusBadge()`, `StatusBadge.tsx`, `StatusBadge.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module Group 41`** (3 nodes): `MockLink()`, `alerts.page.test.tsx`, `alerts.page.test.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module Group 42`** (3 nodes): `MockLink()`, `alertDetail.page.test.tsx`, `alertDetail.page.test.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module Group 43`** (3 nodes): `resetAlertState()`, `alertHandlers.ts`, `alertHandlers.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module Group 158`** (1 nodes): `Database Table: devices`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `SQLAlchemy 2.x ORM` connect `Alert Triage Core` to `API Routing Layer`, `Frontend Components`, `Auth and Multi-Tenancy`, `Test Infrastructure`?**
  _High betweenness centrality (0.230) - this node is a cross-community bridge._
- **Why does `Unit 2: Data Models + Alembic Migration` connect `Frontend Components` to `Alert Triage Core`?**
  _High betweenness centrality (0.185) - this node is a cross-community bridge._
- **Why does `AlertService` connect `API Routing Layer` to `Alert Triage Core`, `Timezone and Utilities`, `Auth and Multi-Tenancy`, `Data Models and Schema`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Are the 40 inferred relationships involving `AlertService` (e.g. with `NotFoundError` and `TransitionError`) actually correct?**
  _`AlertService` has 40 INFERRED edges - model-reasoned connections that need verification._
- **Are the 39 inferred relationships involving `make_alert()` (e.g. with `test_acknowledge_new_alert()` and `test_acknowledge_already_acknowledged_raises_409()`) actually correct?**
  _`make_alert()` has 39 INFERRED edges - model-reasoned connections that need verification._
- **Are the 36 inferred relationships involving `auth_headers()` (e.g. with `test_invalid_token_returns_401()` and `test_valid_token_returns_200()`) actually correct?**
  _`auth_headers()` has 36 INFERRED edges - model-reasoned connections that need verification._
- **Are the 28 inferred relationships involving `run_ingest()` (e.g. with `lifespan()` and `SensorReading`) actually correct?**
  _`run_ingest()` has 28 INFERRED edges - model-reasoned connections that need verification._