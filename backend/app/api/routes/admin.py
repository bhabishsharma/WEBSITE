from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import require_moderator
from app.db.base import get_db
from app.models.photo import Photo, PhotoStatus
from app.models.site import HeritageSite
from app.models.user import User

router = APIRouter(prefix="/admin", tags=["admin"])


class DashboardStats(BaseModel):
    total_sites: int
    published_sites: int
    pending_site_submissions: int
    pending_photos: int


@router.get("/stats", response_model=DashboardStats)
def dashboard_stats(db: Session = Depends(get_db), user: User = Depends(require_moderator)):
    total_sites = db.query(HeritageSite).count()
    published_sites = db.query(HeritageSite).filter(HeritageSite.is_published.is_(True)).count()
    pending_site_submissions = (
        db.query(HeritageSite).filter(HeritageSite.is_published.is_(False)).count()
    )
    pending_photos = db.query(Photo).filter(Photo.status == PhotoStatus.PENDING).count()

    return DashboardStats(
        total_sites=total_sites,
        published_sites=published_sites,
        pending_site_submissions=pending_site_submissions,
        pending_photos=pending_photos,
    )
