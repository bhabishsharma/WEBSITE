"""Run once against a fresh database: `python -m app.db.init_db`.

For anything beyond local dev, replace table creation with Alembic migrations —
this script is intentionally simple so a solo dev can get moving fast.
"""

from sqlalchemy import text

from app.db.base import Base, SessionLocal, engine
from app.models.taxonomy import Category, Province  # noqa: F401 — needed to register tables
from app.models.user import User  # noqa: F401
from app.models.site import HeritageSite  # noqa: F401
from app.models.photo import Photo  # noqa: F401

PROVINCES = [
    ("Koshi", "कोशी", "koshi"),
    ("Madhesh", "मध्येश", "madhesh"),
    ("Bagmati", "बागमती", "bagmati"),
    ("Gandaki", "गण्डकी", "gandaki"),
    ("Lumbini", "लुम्बिनी", "lumbini"),
    ("Karnali", "कर्णाली", "karnali"),
    ("Sudurpashchim", "सुदूरपश्चिम", "sudurpashchim"),
]

CATEGORIES = [
    ("Temple", "मन्दिर", "temple", "landmark"),
    ("Stupa", "स्तूप", "stupa", "landmark"),
    ("Palace Square", "दरबार क्षेत्र", "palace-square", "castle"),
    ("Fort", "किल्ला", "fort", "castle"),
    ("Natural Heritage", "प्राकृतिक सम्पदा", "natural-heritage", "mountain"),
    ("Living Heritage", "जीवित सम्पदा", "living-heritage", "users"),
]


def init_db() -> None:
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis"))
        conn.commit()

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        if not db.query(Province).first():
            for name_en, name_np, slug in PROVINCES:
                db.add(Province(name_en=name_en, name_np=name_np, slug=slug))
        if not db.query(Category).first():
            for name_en, name_np, slug, icon in CATEGORIES:
                db.add(Category(name_en=name_en, name_np=name_np, slug=slug, icon=icon))
        db.commit()
    finally:
        db.close()

    print("Database initialized: PostGIS enabled, tables created, taxonomy seeded.")


if __name__ == "__main__":
    init_db()
