from pydantic import BaseModel, Field

from app.schemas.common import Point, TaxonomyOut


class SiteBase(BaseModel):
    name_en: str = Field(..., max_length=200)
    name_np: str = Field(..., max_length=200)
    description_en: str
    description_np: str
    province_id: str
    category_id: str
    unesco_status: str = "none"
    location: Point
    address: str | None = None
    established_year: int | None = None


class SiteCreate(SiteBase):
    """Used for both admin-created and crowdsourced submissions.

    Crowdsourced submissions are forced to is_published=False server-side
    regardless of what's sent here — see api/routes/sites.py.
    """


class SiteUpdate(BaseModel):
    name_en: str | None = None
    name_np: str | None = None
    description_en: str | None = None
    description_np: str | None = None
    province_id: str | None = None
    category_id: str | None = None
    unesco_status: str | None = None
    location: Point | None = None
    address: str | None = None
    established_year: int | None = None
    is_published: bool | None = None


class SiteListItem(BaseModel):
    id: str
    slug: str
    name_en: str
    name_np: str
    province: TaxonomyOut
    category: TaxonomyOut
    unesco_status: str
    location: Point
    cover_photo_url: str | None = None
    distance_km: float | None = None  # populated only on "near me" queries

    class Config:
        from_attributes = True


class SiteDetail(SiteListItem):
    description_en: str
    description_np: str
    address: str | None = None
    established_year: int | None = None
    is_published: bool
