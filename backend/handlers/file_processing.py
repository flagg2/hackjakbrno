import os
from uuid import UUID
from datetime import datetime

from fastapi import APIRouter, HTTPException
from fastapi import status

from backend.domain.bar_chart import dosage_distribution, highest_bolus_dosage, hypoglycemia
from backend.domain.line_plot import line_plot_glycemia, Dose, line_plot_bolus, line_plot_basal
from backend.domain.utils import extreme_timestamps
from backend.schema.file_processing import GlycemiaResponseBody, BasalInsulinResponseBody, BolusInsulinResponseBody, \
    DosageDistributionResponseBody, HighestBolusDosageDistributionResponseBody, HypoglycemiaDistributionResponseBody

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
            file = f"/tmp/{file_id}/{dirnames[0]}/cgm_data_1.csv"
            data=line_plot_glycemia(
                file=file,
                from_datetime=from_datetime,
                to_datetime=to_datetime,
                step_in_minutes=step_in_minutes,
            )
            timestamps = extreme_timestamps(file)
            return GlycemiaResponseBody.from_data_and_timestamps(data, *timestamps)
    except Exception as e:
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
            data=dosage_distribution(
                file_basal=file_basal,
                file_bolus=file_bolus,
                from_datetime=from_datetime,
                to_datetime=to_datetime,
                step_in_minutes=step_in_minutes,
            )
            start_basal, end_basal = extreme_timestamps(file_basal)
            start_bolus, end_bolus = extreme_timestamps(file_bolus)
            return DosageDistributionResponseBody.from_data_and_timestamps(data, min(start_basal, start_bolus), max(end_basal, end_bolus))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Error")


@router.get(
    "/get-highest-bolus-dosage-distribution",
    responses = {
        status.HTTP_200_OK: {"model": HighestBolusDosageDistributionResponseBody},
    },
    operation_id="get_highest_bolus_dosage_distribution"
)
async def get_highest_bolus_dosage_distribution(
    file_id: UUID,
    from_datetime: datetime,
    to_datetime: datetime,
    step_in_minutes: int = 60,
    quantile: float = 0.8,
) -> HighestBolusDosageDistributionResponseBody:
    try:
        with os.scandir(f"/tmp/{file_id}") as entries:
            dirnames = [entry.name for entry in entries if (entry.is_dir() and (entry.name != "." and entry.name != ".." and entry.name != "__MACOSX"))]
            assert len(dirnames) == 1, dirnames
            file_bolus = f"/tmp/{file_id}/{dirnames[0]}/Insulin data/bolus_data_1.csv"
            data=highest_bolus_dosage(
                file=file_bolus,
                from_datetime=from_datetime,
                to_datetime=to_datetime,
                step_in_minutes=step_in_minutes,
                quantile=quantile,
            )
            start_bolus, end_bolus = extreme_timestamps(file_bolus)
            return HighestBolusDosageDistributionResponseBody.from_data_and_timestamps(data, start_bolus, end_bolus)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Error")


@router.get(
    "/get-hypoglycemia-distribution",
    responses = {
        status.HTTP_200_OK: {"model": HypoglycemiaDistributionResponseBody},
    },
    operation_id="get_hypoglycemia_distribution"
)
async def get_hypoglycemia_distribution(
        file_id: UUID,
        from_datetime: datetime,
        to_datetime: datetime,
        step_in_minutes: int = 60,
) -> HypoglycemiaDistributionResponseBody:
    try:
        with os.scandir(f"/tmp/{file_id}") as entries:
            dirnames = [entry.name for entry in entries if (entry.is_dir() and (entry.name != "." and entry.name != ".." and entry.name != "__MACOSX"))]
            assert len(dirnames) == 1, dirnames
            file_bolus = f"/tmp/{file_id}/{dirnames[0]}/Insulin data/bolus_data_1.csv"
            file_glucose = f"/tmp/{file_id}/{dirnames[0]}/cgm_data_1.csv"
            data=hypoglycemia(
                file_bolus=file_bolus,
                file_glucose=file_glucose,
                from_datetime=from_datetime,
                to_datetime=to_datetime,
                step_in_minutes=step_in_minutes,
            )
            start_bolus, end_bolus = extreme_timestamps(file_bolus)
            start_glucose, end_glucose = extreme_timestamps(file_glucose)
            return HypoglycemiaDistributionResponseBody.from_data_and_timestamps(data, min(start_bolus, start_glucose), max(end_bolus, end_glucose))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Error")
