"""Thin abstraction so routes don't care whether images live in Cloudinary or S3.

Swap providers by changing STORAGE_PROVIDER in .env — no route code changes needed.
"""

import uuid

from fastapi import UploadFile

from app.core.config import settings


class UploadResult:
    def __init__(self, url: str, storage_key: str):
        self.url = url
        self.storage_key = storage_key


def upload_photo(file: UploadFile, folder: str = "heritage-lens") -> UploadResult:
    if settings.STORAGE_PROVIDER == "s3":
        return _upload_to_s3(file, folder)
    return _upload_to_cloudinary(file, folder)


def _upload_to_cloudinary(file: UploadFile, folder: str) -> UploadResult:
    import cloudinary
    import cloudinary.uploader

    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
    )
    result = cloudinary.uploader.upload(file.file, folder=folder)
    return UploadResult(url=result["secure_url"], storage_key=result["public_id"])


def _upload_to_s3(file: UploadFile, folder: str) -> UploadResult:
    import boto3

    client = boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION,
    )
    key = f"{folder}/{uuid.uuid4()}-{file.filename}"
    client.upload_fileobj(file.file, settings.AWS_S3_BUCKET, key, ExtraArgs={"ACL": "public-read"})
    url = f"https://{settings.AWS_S3_BUCKET}.s3.{settings.AWS_S3_REGION}.amazonaws.com/{key}"
    return UploadResult(url=url, storage_key=key)


def delete_photo(storage_key: str) -> None:
    if settings.STORAGE_PROVIDER == "s3":
        import boto3

        client = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION,
        )
        client.delete_object(Bucket=settings.AWS_S3_BUCKET, Key=storage_key)
    else:
        import cloudinary
        import cloudinary.uploader

        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
        )
        cloudinary.uploader.destroy(storage_key)
