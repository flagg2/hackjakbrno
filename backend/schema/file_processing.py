from dataclasses import asdict
from datetime import datetime

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
    min_timestamp: datetime
    max_timestamp: datetime

    @classmethod
    def from_data_and_timestamps(cls, data: list[LinePlotData], min_timestamp: datetime, max_timestamp: datetime) -> "GlycemiaResponseBody":
        return cls(
            data=[DataResponseBody.from_data(d) for d in data],
            min_timestamp=min_timestamp,
            max_timestamp=min_timestamp,
        )


class BasalInsulinResponseBody(BaseModel):
    data: list[DataResponseBody]
    min_timestamp: datetime
    max_timestamp: datetime

    @classmethod
    def from_data_and_timestamps(cls, data: list[LinePlotData], min_timestamp: datetime, max_timestamp: datetime) -> "BasalInsulinResponseBody":
        return cls(
            data=[DataResponseBody.from_data(d) for d in data],
            min_timestamp=min_timestamp,
            max_timestamp=min_timestamp,
        )


class BolusInsulinResponseBody(BaseModel):
    data: list[DataResponseBody]
    min_timestamp: datetime
    max_timestamp: datetime

    @classmethod
    def from_data_and_timestamps(cls, data: list[LinePlotData], min_timestamp: datetime, max_timestamp: datetime) -> "BolusInsulinResponseBody":
        return cls(
            data=[DataResponseBody.from_data(d) for d in data],
            min_timestamp=min_timestamp,
            max_timestamp=min_timestamp,
        )
