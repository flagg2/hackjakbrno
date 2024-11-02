from pydantic import BaseModel


class InsertPatientEmbeddingResponseBody(BaseModel):
    embedding: list[float]


class GetSimilarPatientsResponseBody(BaseModel):
    patients: list[str]