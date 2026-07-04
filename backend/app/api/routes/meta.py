from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.base import get_db
from app.models.taxonomy import Category, Province
from app.schemas.common import TaxonomyOut

router = APIRouter(tags=["meta"])


@router.get("/provinces", response_model=list[TaxonomyOut])
def list_provinces(db: Session = Depends(get_db)):
    return db.query(Province).order_by(Province.name_en).all()


@router.get("/categories", response_model=list[TaxonomyOut])
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).order_by(Category.name_en).all()
