from datetime import datetime, timezone

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_moderator
from app.db.base import get_db
from app.models.photo import Photo, PhotoSource, PhotoStatus
from app.models.site import HeritageSite
from app.models.user import User, UserRole
from app.schemas.photo import PhotoModerateRequest, PhotoOut
from app.services.storage import delete_photo, upload_photo

router = APIRouter(tags=["photos"])


@router.get("/sites/{site_id}/photos", response_model=list[PhotoOut])
def list_site_photos(
    site_id: str,
    include_pending: bool = False,
    db: Session = Depends(get_db),
):
    query = db.query(Photo).filter(Photo.site_id == site_id)
    if not include_pending:
        query = query.filter(Photo.status == PhotoStatus.APPROVED)
    return query.order_by(Photo.is_cover.desc(), Photo.created_at.desc()).all()


@router.post("/sites/{site_id}/photos", response_model=PhotoOut, status_code=status.HTTP_201_CREATED)
def upload_site_photo(
    site_id: str,
    file: UploadFile = File(...),
    caption_en: str | None = Form(None),
    caption_np: str | None = Form(None),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Anyone logged in can submit a photo. Official-gallery status is earned, not chosen:
    moderator/admin uploads go straight into the official, approved gallery; everyone else's
    submissions land in the moderation queue as user-source/pending.
    """
    site = db.get(HeritageSite, site_id)
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")

    is_staff = user.role in (UserRole.MODERATOR, UserRole.ADMIN)
    result = upload_photo(file, folder=f"heritage-lens/{site.slug}")

    photo = Photo(
        site_id=site_id,
        url=result.url,
        storage_key=result.storage_key,
        caption_en=caption_en,
        caption_np=caption_np,
        source=PhotoSource.OFFICIAL if is_staff else PhotoSource.USER,
        status=PhotoStatus.APPROVED if is_staff else PhotoStatus.PENDING,
        uploaded_by=user.id,
        moderated_by=user.id if is_staff else None,
        moderated_at=datetime.now(timezone.utc) if is_staff else None,
    )
    db.add(photo)
    db.commit()
    db.refresh(photo)
    return photo


@router.get("/admin/photos/pending", response_model=list[PhotoOut])
def list_pending_photos(db: Session = Depends(get_db), user: User = Depends(require_moderator)):
    return (
        db.query(Photo)
        .filter(Photo.status == PhotoStatus.PENDING)
        .order_by(Photo.created_at.asc())
        .all()
    )


@router.patch("/photos/{photo_id}/moderate", response_model=PhotoOut)
def moderate_photo(
    photo_id: str,
    payload: PhotoModerateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(require_moderator),
):
    photo = db.get(Photo, photo_id)
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")

    photo.status = PhotoStatus.APPROVED if payload.approve else PhotoStatus.REJECTED
    photo.moderated_by = user.id
    photo.moderated_at = datetime.now(timezone.utc)
    if not payload.approve:
        photo.rejection_reason = payload.rejection_reason
    db.commit()
    db.refresh(photo)
    return photo


@router.delete("/photos/{photo_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_photo(photo_id: str, db: Session = Depends(get_db), user: User = Depends(require_moderator)):
    photo = db.get(Photo, photo_id)
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    delete_photo(photo.storage_key)
    db.delete(photo)
    db.commit()
