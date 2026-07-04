import uuid
from datetime import datetime

from geoalchemy2 import Geometry
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.taxonomy import UnescoStatus


class HeritageSite(Base):
    __tablename__ = "heritage_sites"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Bilingual content — every user-facing site record needs both.
    name_en: Mapped[str] = mapped_column(String(200), nullable=False)
    name_np: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(220), unique=True, nullable=False, index=True)
    description_en: Mapped[str] = mapped_column(Text, nullable=False)
    description_np: Mapped[str] = mapped_column(Text, nullable=False)

    # Taxonomy
    province_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("provinces.id"), nullable=False
    )
    category_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("categories.id"), nullable=False
    )
    unesco_status: Mapped[UnescoStatus] = mapped_column(
        String(20), default=UnescoStatus.NONE, nullable=False
    )

    # Location — SRID 4326 (WGS84 lat/lng), indexed for "near me" queries.
    location: Mapped[str] = mapped_column(Geometry(geometry_type="POINT", srid=4326), nullable=False)
    address: Mapped[str | None] = mapped_column(String(300), nullable=True)
    established_year: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # Crowdsourcing / moderation
    submitted_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    province = relationship("Province")
    category = relationship("Category")
    photos = relationship("Photo", back_populates="site", cascade="all, delete-orphan")
