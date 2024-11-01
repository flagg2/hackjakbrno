from pydantic import BaseModel


class ErrorResponseBody(BaseModel):
    detail: str
