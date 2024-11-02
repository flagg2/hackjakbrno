import shutil
import zipfile
import os


from pathlib import Path
from uuid import uuid4
from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi import status

from backend.schema.errors import ErrorResponseBody
from backend.schema.file_upload import UploadZipResponseBody

router = APIRouter()

@router.post(
    "/upload-zip",
    responses={
        status.HTTP_200_OK: {"model": UploadZipResponseBody},
    },
    operation_id="upload_zip"
)
async def upload_zip(
    file: UploadFile = File(...),
) -> UploadZipResponseBody:
    if not (file.filename is not None and file.filename.endswith('.zip')):
        raise HTTPException(
            status_code=400,
            detail="File must be a ZIP archive with .zip suffix."
        )

    assert file.filename is not None

    file_id = uuid4()
    extract_path = Path(f"/tmp/{file_id}")
    extract_path.mkdir(parents=True)

    temp_file = extract_path / file.filename
    
    with open(temp_file, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        with zipfile.ZipFile(temp_file, 'r') as zip_ref:
            zip_ref.extractall(extract_path)
    
    except zipfile.BadZipFile:
        raise HTTPException(
            status_code=400,
            detail="Invalid ZIP file",
        )
    finally:
        os.remove(temp_file)

    return UploadZipResponseBody(file_id=file_id)
