from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import admin, auth, meta, photos, sites
from app.core.config import settings

app = FastAPI(
    title="Heritage Lens API",
    description="Crowdsourced + curated catalogue of Nepal's heritage sites.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(sites.router)
app.include_router(photos.router)
app.include_router(meta.router)
app.include_router(admin.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
