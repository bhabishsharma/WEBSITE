from pydantic import BaseModel, Field


class Point(BaseModel):
    """GeoJSON-style point, always [longitude, latitude] order to match PostGIS/Leaflet conventions."""

    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)


class Paginated(BaseModel):
    total: int
    page: int
    page_size: int
    items: list


class TaxonomyOut(BaseModel):
    id: str
    name_en: str
    name_np: str
    slug: str

    class Config:
        from_attributes = True
