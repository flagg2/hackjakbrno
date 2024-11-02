import os
from uuid import UUID
from datetime import datetime

from fastapi import APIRouter, HTTPException
from fastapi import status

from backend.domain.bar_chart import bar_chart
from backend.domain.line_plot import line_plot_glycemia, Dose, line_plot_bolus, line_plot_basal
from backend.domain.utils import extreme_timestamps
from backend.schema.file_processing import GlycemiaResponseBody, BasalInsulinResponseBody, BolusInsulinResponseBody, \
    DosageDistributionResponseBody

router = APIRouter()

@router.get(
    "/get-glycemia",
    responses = {
        status.HTTP_200_OK: {"model": GlycemiaResponseBody},
    },
    operation_id="get_glycemia"
)
async def get_glycemia(
    file_id: UUID,
    from_datetime: datetime,
    to_datetime: datetime,
    step_in_minutes: int = 60,
) -> GlycemiaResponseBody:
    try:
        with os.scandir(f"/tmp/{file_id}") as entries:
            dirnames = [entry.name for entry in entries if (entry.is_dir() and (entry.name != "." and entry.name != ".." and entry.name != "__MACOSX"))]
            assert len(dirnames) == 1, dirnames
            file = f"/tmp/{file_id}/{dirnames[0]}/cgm_data_1.csv",
            data=line_plot_glycemia(
                file=file,
                from_datetime=from_datetime,
                to_datetime=to_datetime,
                step_in_minutes=step_in_minutes,
            )
            timestamps = extreme_timestamps(file)
            return GlycemiaResponseBody.from_data_and_timestamps(data, *timestamps)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal Error")

@router.get(
    "/get-basal-insulin",
    responses = {
        status.HTTP_200_OK: {"model": BasalInsulinResponseBody},
    },
    operation_id="get_basal_insulin"
)
async def get_basal_insulin(
        file_id: UUID,
        from_datetime: datetime,
        to_datetime: datetime,
        step_in_minutes: int = 60,
) -> BasalInsulinResponseBody:
    try:
        with os.scandir(f"/tmp/{file_id}") as entries:
            dirnames = [entry.name for entry in entries if (entry.is_dir() and (entry.name != "." and entry.name != ".." and entry.name != "__MACOSX"))]
            assert len(dirnames) == 1, dirnames
            file = f"/tmp/{file_id}/{dirnames[0]}/Insulin data/basal_data_1.csv"
            timestamps = extreme_timestamps(file)
            data=line_plot_basal(
                file=file,
                from_datetime=from_datetime,
                to_datetime=to_datetime,
                step_in_minutes=step_in_minutes,
            )
            return BasalInsulinResponseBody.from_data_and_timestamps(data, *timestamps)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal Error")


@router.get(
    "/get-bolus-insulin",
    responses = {
        status.HTTP_200_OK: {"model": BolusInsulinResponseBody},
    },
    operation_id="get_bolus_insulin"
)
async def get_bolus_insulin(
        file_id: UUID,
        from_datetime: datetime,
        to_datetime: datetime,
        step_in_minutes: int = 60,
        dose: Dose = Dose.ALL,
) -> BolusInsulinResponseBody:
    try:
        with os.scandir(f"/tmp/{file_id}") as entries:
            dirnames = [entry.name for entry in entries if (entry.is_dir() and (entry.name != "." and entry.name != ".." and entry.name != "__MACOSX"))]
            assert len(dirnames) == 1, dirnames
            file = f"/tmp/{file_id}/{dirnames[0]}/Insulin data/bolus_data_1.csv"
            data=line_plot_bolus(
                file=file,
                from_datetime=from_datetime,
                to_datetime=to_datetime,
                step_in_minutes=step_in_minutes,
                dose=dose,
            )
            timestamps = extreme_timestamps(file)
            return GlycemiaResponseBody.from_data_and_timestamps(data, *timestamps)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal Error")


@router.get(
    "/get-dosage-distribution",
    responses = {
        status.HTTP_200_OK: {"model": DosageDistributionResponseBody},
    },
    operation_id="get_dosage_distribution"
)
async def get_dosage_distribution(
        file_id: UUID,
        from_datetime: datetime,
        to_datetime: datetime,
        step_in_minutes: int = 60,
) -> DosageDistributionResponseBody:
    try:
        with os.scandir(f"/tmp/{file_id}") as entries:
            dirnames = [entry.name for entry in entries if (entry.is_dir() and (entry.name != "." and entry.name != ".." and entry.name != "__MACOSX"))]
            assert len(dirnames) == 1, dirnames
            file_basal = f"/tmp/{file_id}/{dirnames[0]}/Insulin data/basal_data_1.csv"
            file_bolus = f"/tmp/{file_id}/{dirnames[0]}/Insulin data/bolus_data_1.csv"
            data=bar_chart(
                file_basal=file_basal,
                file_bolus=file_bolus,
                from_datetime=from_datetime,
                to_datetime=to_datetime,
                step_in_minutes=step_in_minutes,
            )
            return DosageDistributionResponseBody.from_data(data)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal Error")
