import enum
import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class PhotoSource(str, enum.Enum):
    OFFICIAL = "official"   # curated by admins/moderators, shown by default
    USER = "user"           # crowdsourced, gated behind moderation


class PhotoStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class Photo(Base):
    __tablename__ = "photos"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    site_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("heritage_sites.id"), nullable=False, index=True
    )

    url: Mapped[str] = mapped_column(String(500), nullable=False)
    storage_key: Mapped[str] = mapped_column(String(500), nullable=False)  # Cloudinary public_id / S3 key
    caption_en: Mapped[str | None] = mapped_column(Text, nullable=True)
    caption_np: Mapped[str | None] = mapped_column(Text, nullable=True)

    source: Mapped[PhotoSource] = mapped_column(String(20), nullable=False)
    status: Mapped[PhotoStatus] = mapped_column(
        String(20), default=PhotoStatus.PENDING, nullable=False, index=True
    )
    is_cover: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    uploaded_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    moderated_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    moderated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    rejection_reason: Mapped[str | None] = mapped_column(String(300), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    site = relationship("HeritageSite", back_populates="photos")
