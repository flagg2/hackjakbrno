import os
from uuid import UUID
from datetime import datetime

from fastapi import APIRouter, HTTPException
from fastapi import status

from backend.domain.line_plot import line_plot_glycemia
from backend.schema.file_processing import GlycemiaResponseBody

router = APIRouter()

@router.get(
    "/get-glycemia",
    responses = {
        status.HTTP_200_OK: {"model": GlycemiaResponseBody},
    },
)
async def get_glycemia(
    file_id: UUID,
    from_datetime: datetime,
    to_datetime: datetime,
    step: int = 60,
) -> GlycemiaResponseBody:
    try:
        with os.scandir(f"/tmp/{file_id}") as entries:
            dirnames = [entry.name for entry in entries if (entry.is_dir() and (entry.name != "." and entry.name != ".." and entry.name != "__MACOSX"))]
            assert len(dirnames) == 1, dirnames
            return GlycemiaResponseBody(
                data=line_plot_glycemia(
                    file=f"/tmp/{file_id}/{dirnames[0]}/cgm_data_1.csv",
                    from_datetime=from_datetime,
                    to_datetime=to_datetime,
                    step=step,
                )
            )
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal Error")

