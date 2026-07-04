from pydantic import BaseModel


class PhotoOut(BaseModel):
    id: str
    site_id: str
    url: str
    caption_en: str | None
    caption_np: str | None
    source: str
    status: str
    is_cover: bool
    uploaded_by: str | None

    class Config:
        from_attributes = True


class PhotoModerateRequest(BaseModel):
    approve: bool
    rejection_reason: str | None = None
