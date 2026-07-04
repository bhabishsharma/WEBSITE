import enum
import uuid

from sqlalchemy import String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class UnescoStatus(str, enum.Enum):
    NONE = "none"
    TENTATIVE = "tentative"
    WORLD_HERITAGE = "world_heritage"


class Province(Base):
    """Nepal's 7 provinces. Seeded once via db/init_db.py, rarely written to after."""

    __tablename__ = "provinces"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name_en: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    name_np: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)


class Category(Base):
    """e.g. Temple, Stupa, Palace Square, Fort, Natural Heritage, Living Heritage."""

    __tablename__ = "categories"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name_en: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    name_np: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    icon: Mapped[str | None] = mapped_column(String(50), nullable=True)  # lucide-react icon name
