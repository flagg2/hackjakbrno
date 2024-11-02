from dataclasses import asdict

from pydantic import BaseModel

from backend.domain.line_plot import Data as LinePlotData, Measurements


class MeasurementsResponseBody(BaseModel):
    median: float
    mean: float
    min: float
    max: float
    q10: float
    q25: float
    q75: float
    q90: float

    @classmethod
    def from_measurements(cls, measurements: Measurements) -> "MeasurementsResponseBody":
        return cls(**asdict(measurements))


class DataResponseBody(BaseModel):
    time: int
    measurements: MeasurementsResponseBody

    @classmethod
    def from_data(cls, data: LinePlotData) -> "DataResponseBody":
        return cls(**asdict(data))


class GlycemiaResponseBody(BaseModel):
    data: list[DataResponseBody]

    @classmethod
    def from_data(cls, data: list[LinePlotData]):
        return cls(data=[DataResponseBody.from_data(d) for d in data])


class BasalInsulinResponseBody(BaseModel):
    data: list[DataResponseBody]

    @classmethod
    def from_data(cls, data: list[LinePlotData]):
        return cls(data=[DataResponseBody.from_data(d) for d in data])


class BolusInsulinResponseBody(BaseModel):
    data: list[DataResponseBody]

    @classmethod
    def from_data(cls, data: list[LinePlotData]):
        return cls(data=[DataResponseBody.from_data(d) for d in data])
