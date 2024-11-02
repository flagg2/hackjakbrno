from pydantic import BaseModel


class InsertPatientEmbeddingResponseBody(BaseModel):
    embedding: list[float]