# Heritage Lens

A crowdsourced + curated catalogue of Nepal's heritage sites — interactive map,
dual photo galleries (official + community, with moderation), province/category/
UNESCO filters, and an English/Nepali toggle.

## Stack

| Layer     | Choice                                              |
|-----------|------------------------------------------------------|
| Frontend  | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| Backend   | FastAPI (Python)                                    |
| Database  | PostgreSQL + PostGIS                                |
| Storage   | Cloudinary or S3 (swap via one env var)             |
| Map       | Leaflet + OpenStreetMap tiles                       |

**Backend: FastAPI, not Django.** Faster to iterate solo, matches the rest of
the stack's async-first style. Trade-off: there's no built-in admin UI — the
`/admin/*` API routes in this scaffold (pending photo queue, dashboard stats)
are the foundation for a custom admin screen you'll build in the frontend.
If solo moderation-by-Django-admin becomes more valuable than that flexibility,
the models in `backend/app/models/` translate directly to Django models if you
change course later.

## What's scaffolded

```
heritage-lens/
├── backend/                 FastAPI app
│   ├── app/
│   │   ├── models/          User, HeritageSite, Photo, Province, Category
│   │   ├── schemas/         Pydantic request/response shapes
│   │   ├── api/routes/      auth, sites, photos, meta, admin
│   │   ├── services/        storage.py — Cloudinary/S3 abstraction
│   │   ├── db/               engine/session + init_db.py (PostGIS + seed data)
│   │   └── main.py
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
├── frontend/                Next.js app
│   ├── app/                  page.tsx (homepage), sites/[slug]/page.tsx
│   ├── components/           Header, MapView, FilterSidebar, SiteCard, ToranaDivider
│   ├── lib/                  api client, i18n dictionary, types, demo data
│   └── context/              LanguageContext (EN/NP toggle)
└── docker-compose.yml        Postgres+PostGIS, ready for the backend container
```

This covers the full request path for the map/filter/detail flow end to end —
it's a working skeleton to build on, not just stub files. What's **not** built
yet: the actual admin dashboard UI (the API routes exist; the screen doesn't),
the crowdsourced submission form, and photo upload UI on the frontend.

## Running it locally

### 1. Database

```bash
docker compose up -d db
```

This starts Postgres with the PostGIS extension pre-installed via the
`postgis/postgis` image.

### 2. Backend

```bash
cd backend
cp .env.example .env        # fill in SECRET_KEY and storage provider keys
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python -m app.db.init_db    # enables PostGIS, creates tables, seeds provinces/categories
uvicorn app.main:app --reload
```

API docs at `http://localhost:8000/docs` (FastAPI's auto-generated Swagger UI —
this is most of what Django's admin would have given you for free, for
inspecting/testing endpoints, though it won't let you edit data through a UI).

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`. If the backend isn't running yet, the homepage
falls back to sample data automatically so you can see the real layout
without wiring things up first — swap `NEXT_PUBLIC_API_URL` in a `.env.local`
once the backend is live.

## Data model notes

- **Bilingual by design**: `HeritageSite` and taxonomy tables carry `_en`/`_np`
  fields side by side rather than a separate translations table — simpler for
  a two-language app, revisit if a third language gets added later.
- **Location** is a PostGIS `POINT(lng, lat)` in SRID 4326. The "near me"
  filter (`GET /sites?lat=...&lng=...&radius_km=...`) uses `ST_Distance` —
  fine at this scale; if the catalogue grows into the tens of thousands of
  sites, add a GiST index on `location` (PostGIS creates one by default on
  geometry columns, already covered here) and consider `ST_DWithin` for the
  filter instead of computing distance for every row.
- **Photo moderation**: uploads from a `moderator`/`admin` land as
  `source=official, status=approved` immediately; everyone else's land as
  `source=user, status=pending` and need a `PATCH /photos/{id}/moderate` call.
  This is the dual-gallery behavior from the spec, enforced server-side rather
  than trusted from the client.
- **Site submissions** are always created `is_published=false` — a moderator
  publishes via `PATCH /sites/{id}`. No public site goes live without a human
  looking at it first.

## Decisions still worth making early

- **Auth for the frontend**: the backend issues JWTs from `/auth/login`; the
  frontend doesn't yet have a login form or token storage. Cookies (httpOnly)
  vs. localStorage is worth deciding before building that out.
- **Image sizes**: Cloudinary can do on-the-fly resizing/transformation; S3
  needs a separate step (e.g. a Lambda or `next/image`'s own optimizer) if you
  want responsive thumbnails. Factor this into the Cloudinary-vs-S3 choice if
  it isn't already decided.
- **Alembic**: `db/init_db.py` uses `Base.metadata.create_all`, which is fine
  for getting started but doesn't handle future schema changes gracefully.
  Set up Alembic before the schema stabilizes and you have real data to lose.
