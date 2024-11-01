from pydantic import BaseModel
from uuid import UUID


class UploadZipResponseBody(BaseModel):
    file_id: UUID
