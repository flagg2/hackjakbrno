from dataclasses import dataclass
from datetime import datetime

import pandas as pd


@dataclass
class MeasurementsDosageDistribution:
    basal: float
    auto_bolus: float
    self_bolus: float


@dataclass
class DataDosageDistribution:
    time: int
    measurements: MeasurementsDosageDistribution


@dataclass
class MeasurementsHighestBolusDosage:
    percentage: float
    toltip_med: float
    toltip_max: float
    toltip_min: float


@dataclass
class DataHighestBolusDosage:
    time: int
    measurements: MeasurementsHighestBolusDosage


def aggreate_df(df: pd.DataFrame, step: int) -> pd.DataFrame:
    df["round_timestamp"] = df.index.round("h")

    df = df.groupby("round_timestamp").sum()
    df = df.resample('H').asfreq().fillna(0)
    df["hour_of_day"] = df.index.hour // step * step

    df = df.groupby("hour_of_day").mean()
    df = df.reindex(pd.Index(range(24), name='hour_of_day'), fill_value=0)

    return df


def dosage_distribution(
    file_basal: str,
    file_bolus: str,
    from_datetime: datetime,
    to_datetime: datetime,
    step_in_minutes: int,
) -> list[DataDosageDistribution]:
    step = step_in_minutes // 60
    basal = pd.read_csv(file_basal, header=1, index_col=0)
    basal = basal[["Rate"]]
    basal.index = pd.to_datetime(basal.index)
    basal = basal[~basal.index.duplicated(keep='first')]
    basal = basal.resample("min").ffill()
    basal["Insulin Delivered (U)"] = basal["Rate"] / 60

    bolus = pd.read_csv(file_bolus, header=1, index_col=0)
    bolus = bolus[["Carbs Input (g)", "Insulin Delivered (U)"]]
    bolus.index = pd.to_datetime(bolus.index)
    bolus = bolus.sort_index()
    auto_bolus = bolus[bolus["Carbs Input (g)"] != 0.0][["Insulin Delivered (U)"]]
    self_bolus = bolus[bolus["Carbs Input (g)"] == 0.0][["Insulin Delivered (U)"]]

    basal = basal.loc[from_datetime:to_datetime]
    basal = aggreate_df(basal, step)

    auto_bolus = auto_bolus.loc[from_datetime:to_datetime]
    auto_bolus = aggreate_df(auto_bolus, step)

    self_bolus = self_bolus.loc[from_datetime:to_datetime]
    self_bolus = aggreate_df(self_bolus, step)

    return [
        DataDosageDistribution(
            time=int(time),
            measurements=MeasurementsDosageDistribution(
                basal=basal.loc[time, "Insulin Delivered (U)"],
                auto_bolus=auto_bolus.loc[time, "Insulin Delivered (U)"],
                self_bolus=self_bolus.loc[time, "Insulin Delivered (U)"],
            )
        )
        for time in range(0, 24, step)
    ]


def highest_bosul_dosage(
    file: str,
    from_datetime: datetime,
    to_datetime: datetime,
    step_in_minutes: int,
    quantile: float,
) -> list[DataHighestBolusDosage]:
    step = step_in_minutes // 60
    df = pd.read_csv(file, header=1, index_col=0)
    df = df[["Insulin Delivered (U)"]]
    df = df.sort_index()
    df.index = pd.to_datetime(df.index)
    df = df.loc[from_datetime:to_datetime]

    df["hour_of_day"] = df.index.hour // step * step
    df = df[df["Insulin Delivered (U)"] > df["Insulin Delivered (U)"].quantile(quantile)]
    df = df.groupby("hour_of_day")["Insulin Delivered (U)"].agg(
        percentage=lambda x: x.count() / df["Insulin Delivered (U)"].count(),
        toltip_med="median",
        toltip_max="max",
        toltip_min="min",
    )

    return [
        DataHighestBolusDosage(
            time=int(time),
            measurements=MeasurementsHighestBolusDosage(
                percentage=row["percentage"],
                toltip_med=row["toltip_med"],
                toltip_max=row["toltip_max"],
                toltip_min=row["toltip_min"],
            )
        )
        for time, row in df.iterrows()
    ]
