import os
from uuid import UUID

from fastapi import APIRouter, HTTPException
from fastapi import status
from sqlalchemy import text

from backend.domain.embedding import get_embedding
from backend.infrastructure.iris import engine
from backend.schema.similarity_search import InsertPatientEmbeddingResponseBody

router = APIRouter()

@router.post(
    "/insert-patient-embedding",
    responses={
        status.HTTP_200_OK: {"model": InsertPatientEmbeddingResponseBody},
    },
    operation_id="insert_patient_embedding"
)
async def insert_patient_embedding(
    file_id: UUID,
) -> InsertPatientEmbeddingResponseBody:
    try:
        with os.scandir(f"/tmp/{file_id}") as entries:
            dirnames = [entry.name for entry in entries if
                        (entry.is_dir() and (entry.name != "." and entry.name != ".." and entry.name != "__MACOSX"))]
            assert len(dirnames) == 1, dirnames
            file_glycemia = f"/tmp/{file_id}/{dirnames[0]}/cgm_data_1.csv"
            file_basal = f"/tmp/{file_id}/{dirnames[0]}/Insulin data/basal_data_1.csv"
            file_bolus = f"/tmp/{file_id}/{dirnames[0]}/Insulin data/bolus_data_1.csv"
            embedding = get_embedding(
                file_basal=file_basal,
                file_bolus=file_bolus,
                file_glycemia=file_glycemia,
            )
            with engine.connection() as conn:
                with conn.begin():
                    sql = text(
                        """
                        INSERT INTO patients (patient, embedding)
                        VALUES (:patient, TO_VECTOR(:embedding))
                        """
                    )
                    conn.execute(
                        sql, {"patient": dirnames[0], "embedding": embedding}
                    )

            return InsertPatientEmbeddingResponseBody(
                embedding=embedding
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Error")