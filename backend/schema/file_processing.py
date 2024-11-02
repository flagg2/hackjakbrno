from pydantic import BaseModel


class MeasurementsResponseBody(BaseModel):
    median: float
    mean: float
    min: float
    max: float
    q10: float
    q25: float
    q75: float
    q90: float


class DataResponseBody(BaseModel):
    time: int
    measurements: MeasurementsResponseBody


class GlycemiaResponseBody(BaseModel):
    data: list[DataResponseBody]


class BasalInsulinResponseBody(BaseModel):
    data: list[DataResponseBody]


class BolusInsulinResponseBody(BaseModel):
    data: list[DataResponseBody]
