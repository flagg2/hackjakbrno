from dataclasses import asdict
from datetime import datetime

from pydantic import BaseModel

from backend.domain.line_plot import Data as LinePlotData, Measurements
from backend.domain.bar_chart import Data as DosageDistributionBarChartData, Measurements as DosageDistributionMeasurements


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
        return cls(time=data.time, measurements=MeasurementsResponseBody.from_measurements(data.measurements))


class GlycemiaResponseBody(BaseModel):
    data: list[DataResponseBody]
    min_timestamp: datetime
    max_timestamp: datetime

    @classmethod
    def from_data_and_timestamps(cls, data: list[LinePlotData], min_timestamp: datetime, max_timestamp: datetime) -> "GlycemiaResponseBody":
        return cls(
            data=[DataResponseBody.from_data(d) for d in data],
            min_timestamp=min_timestamp,
            max_timestamp=max_timestamp,
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
            max_timestamp=max_timestamp,
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
            max_timestamp=max_timestamp,
        )


class DosageDistributionMeasurementsResponseBody(BaseModel):
    basal: float
    auto_bolus: float
    self_bolus: float

    @classmethod
    def from_dosage_distribution_measurements(cls, measurements: DosageDistributionMeasurements):
        return cls(**asdict(measurements))

class BarChartDataResponseBody(BaseModel):
    time: int
    measurements: DosageDistributionMeasurementsResponseBody

    @classmethod
    def from_data(cls, data: DosageDistributionBarChartData) -> "BarChartDataResponseBody":
        return cls(
            time=data.time,
            measurements=DosageDistributionMeasurementsResponseBody.from_dosage_distribution_measurements(data.measurements)
        )


class DosageDistributionResponseBody(BaseModel):
    data: list[BarChartDataResponseBody]

    @classmethod
    def from_data(cls, data: list[DosageDistributionBarChartData]) -> "DosageDistributionResponseBody":
        return cls(
            data=[
                BarChartDataResponseBody.from_data(d) for d in data
            ]
        )