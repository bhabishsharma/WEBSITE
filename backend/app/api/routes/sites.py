import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from geoalchemy2.functions import ST_Distance, ST_MakePoint, ST_SetSRID
from geoalchemy2.shape import to_shape
from slugify import slugify
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_moderator
from app.core.config import settings
from app.db.base import get_db
from app.models.photo import PhotoStatus
from app.models.site import HeritageSite
from app.models.user import User
from app.schemas.common import Point
from app.schemas.site import SiteCreate, SiteDetail, SiteListItem, SiteUpdate

router = APIRouter(prefix="/sites", tags=["sites"])


def _to_list_item(site: HeritageSite, distance_km: float | None = None) -> SiteListItem:
    cover = next((p.url for p in site.photos if p.is_cover and p.status == PhotoStatus.APPROVED), None)
    return SiteListItem(
        id=str(site.id),
        slug=site.slug,
        name_en=site.name_en,
        name_np=site.name_np,
        province=site.province,
        category=site.category,
        unesco_status=site.unesco_status,
        location=Point(lat=to_shape(site.location).y, lng=to_shape(site.location).x),
        cover_photo_url=cover,
        distance_km=distance_km,
    )


@router.get("", response_model=list[SiteListItem])
def list_sites(
    db: Session = Depends(get_db),
    province: str | None = Query(None, description="Province slug"),
    category: str | None = Query(None, description="Category slug"),
    unesco_status: str | None = Query(None),
    q: str | None = Query(None, description="Search site name (EN or NP)"),
    lat: float | None = Query(None),
    lng: float | None = Query(None),
    radius_km: float | None = Query(25, description="Only used when lat/lng are provided"),
    published_only: bool = Query(True, description="Set false only from admin/moderator context"),
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.DEFAULT_PAGE_SIZE, ge=1, le=settings.MAX_PAGE_SIZE),
):
    """Main map/list feed. Supports "near me" search plus province/category/UNESCO filters."""
    query = db.query(HeritageSite)

    if published_only:
        query = query.filter(HeritageSite.is_published.is_(True))
    if province:
        query = query.join(HeritageSite.province).filter_by(slug=province)
    if category:
        query = query.join(HeritageSite.category).filter_by(slug=category)
    if unesco_status:
        query = query.filter(HeritageSite.unesco_status == unesco_status)
    if q:
        query = query.filter(
            (HeritageSite.name_en.ilike(f"%{q}%")) | (HeritageSite.name_np.ilike(f"%{q}%"))
        )

    distance_map: dict[uuid.UUID, float] = {}
    if lat is not None and lng is not None:
        user_point = ST_SetSRID(ST_MakePoint(lng, lat), 4326)
        distance_expr = ST_Distance(HeritageSite.location, user_point) / 1000.0  # meters -> km
        query = query.add_columns(distance_expr.label("distance_km"))
        query = query.filter(distance_expr <= radius_km).order_by(distance_expr.asc())
        rows = query.offset((page - 1) * page_size).limit(page_size).all()
        sites = []
        for site, distance_km in rows:
            distance_map[site.id] = round(distance_km, 2)
            sites.append(site)
    else:
        sites = (
            query.order_by(HeritageSite.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )

    return [_to_list_item(site, distance_map.get(site.id)) for site in sites]


@router.get("/{slug}", response_model=SiteDetail)
def get_site(slug: str, db: Session = Depends(get_db)):
    site = db.query(HeritageSite).filter(HeritageSite.slug == slug).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    item = _to_list_item(site)
    return SiteDetail(
        **item.model_dump(),
        description_en=site.description_en,
        description_np=site.description_np,
        address=site.address,
        established_year=site.established_year,
        is_published=site.is_published,
    )


@router.post("", response_model=SiteDetail, status_code=status.HTTP_201_CREATED)
def create_site(
    payload: SiteCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Crowdsourced submission. Always created unpublished — a moderator/admin must approve.

    Admins publishing directly should use PATCH /sites/{id} after creation, or a
    future POST /sites?auto_publish=true convenience flag once the admin dashboard exists.
    """
    slug = slugify(payload.name_en)
    if db.query(HeritageSite).filter(HeritageSite.slug == slug).first():
        slug = f"{slug}-{uuid.uuid4().hex[:6]}"

    site = HeritageSite(
        name_en=payload.name_en,
        name_np=payload.name_np,
        slug=slug,
        description_en=payload.description_en,
        description_np=payload.description_np,
        province_id=payload.province_id,
        category_id=payload.category_id,
        unesco_status=payload.unesco_status,
        location=f"SRID=4326;POINT({payload.location.lng} {payload.location.lat})",
        address=payload.address,
        established_year=payload.established_year,
        submitted_by=user.id,
        is_published=False,
    )
    db.add(site)
    db.commit()
    db.refresh(site)
    return get_site(site.slug, db)


@router.patch("/{site_id}", response_model=SiteDetail)
def update_site(
    site_id: str,
    payload: SiteUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(require_moderator),
):
    site = db.get(HeritageSite, site_id)
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")

    updates = payload.model_dump(exclude_unset=True)
    location = updates.pop("location", None)
    if location:
        site.location = f"SRID=4326;POINT({location['lng']} {location['lat']})"
    for field, value in updates.items():
        setattr(site, field, value)

    db.commit()
    db.refresh(site)
    return get_site(site.slug, db)


@router.delete("/{site_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_site(site_id: str, db: Session = Depends(get_db), user: User = Depends(require_moderator)):
    site = db.get(HeritageSite, site_id)
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    db.delete(site)
    db.commit()
