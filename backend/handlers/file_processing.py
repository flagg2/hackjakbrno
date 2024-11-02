import os
from uuid import UUID
from datetime import datetime

from fastapi import APIRouter, HTTPException
from fastapi import status

from backend.domain.line_plot import line_plot_glycemia, Dose, line_plot_bolus, line_plot_basal
from backend.schema.file_processing import GlycemiaResponseBody, BasalInsulinResponseBody, BolusInsulinResponseBody

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

@router.get(
    "/get-basal-insulin",
    responses = {
        status.HTTP_200_OK: {"model": BasalInsulinResponseBody},
    },
)
async def get_basal_insulin(
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
                data=line_plot_basal(
                    file=f"/tmp/{file_id}/{dirnames[0]}/Insulin data/bolus_data_1.csv",
                    from_datetime=from_datetime,
                    to_datetime=to_datetime,
                    step=step,
                )
            )
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal Error")


@router.get(
    "/get-bolus-insulin",
    responses = {
        status.HTTP_200_OK: {"model": BolusInsulinResponseBody},
    },
)
async def get_basal_insulin(
        file_id: UUID,
        from_datetime: datetime,
        to_datetime: datetime,
        step: int = 60,
        dose: Dose = Dose.ALL,
) -> GlycemiaResponseBody:
    try:
        with os.scandir(f"/tmp/{file_id}") as entries:
            dirnames = [entry.name for entry in entries if (entry.is_dir() and (entry.name != "." and entry.name != ".." and entry.name != "__MACOSX"))]
            assert len(dirnames) == 1, dirnames
            return GlycemiaResponseBody(
                data=line_plot_bolus(
                    file=f"/tmp/{file_id}/{dirnames[0]}/Insulin data/basal_data_1.csv",
                    from_datetime=from_datetime,
                    to_datetime=to_datetime,
                    step=step,
                    dose=dose,
                )
            )
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal Error")
