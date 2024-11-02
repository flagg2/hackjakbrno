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


@dataclass
class MeasurementsHypoglycemia:
    combination: int
    self_bolus: int
    auto_bolus: int
    other: int


@dataclass
class DataHypoglycemia:
    time: int
    measurements: MeasurementsHypoglycemia


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
            time=int(time * 60),
            measurements=MeasurementsDosageDistribution(
                basal=basal.loc[time, "Insulin Delivered (U)"],
                auto_bolus=auto_bolus.loc[time, "Insulin Delivered (U)"],
                self_bolus=self_bolus.loc[time, "Insulin Delivered (U)"],
            )
        )
        for time in range(0, 24, step)
    ]


def highest_bolus_dosage(
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
            time=int(time * 60),
            measurements=MeasurementsHighestBolusDosage(
                percentage=row["percentage"],
                toltip_med=row["toltip_med"],
                toltip_max=row["toltip_max"],
                toltip_min=row["toltip_min"],
            )
        )
        for time, row in df.iterrows()
    ]


def hypoglycemia(
    file_bolus: str,
    file_glucose: str,
    from_datetime: datetime,
    to_datetime: datetime,
    step_in_minutes: int,
) -> list[DataHypoglycemia]:
    step = step_in_minutes // 60
    glucose = pd.read_csv(file_glucose, header=1, index_col=0)
    glucose.index = pd.to_datetime(glucose.index)
    glucose = glucose.sort_index()
    glucose = glucose.loc[from_datetime:to_datetime]
    glucose = glucose[["CGM Glucose Value (mmol/l)"]]
    glucose["timestamp_round"] = glucose.index.round("h")
    glucose = glucose.groupby("timestamp_round").min()
    glucose["hypoglycemia"] = glucose["CGM Glucose Value (mmol/l)"] < 3.9
    glucose["hypoglycemia+1"] = glucose["hypoglycemia"].shift(-1)
    glucose["hypoglycemia+2"] = glucose["hypoglycemia"].shift(-2)
    glucose = glucose[["hypoglycemia", "hypoglycemia+1", "hypoglycemia+2"]]

    bolus = pd.read_csv(file_bolus, header=1, index_col=0)
    bolus.index = pd.to_datetime(bolus.index)
    bolus = bolus.sort_index()
    bolus = bolus.loc[from_datetime:to_datetime]
    bolus = bolus[["Carbs Input (g)"]]
    bolus["self"] = bolus["Carbs Input (g)"] == 0.0
    bolus["auto"] = bolus["Carbs Input (g)"] > 0.0
    bolus["timestamp_round"] = bolus.index.round("h")
    bolus = bolus.groupby("timestamp_round").max()
    bolus = bolus[["self", "auto"]]
    merged = glucose.merge(bolus, on="timestamp_round", how="outer").fillna(False)

    merged["self-1"] = merged["self"].shift(1)
    merged["self-2"] = merged["self"].shift(2)
    merged["self+1"] = merged["self"].shift(-1)
    merged["self+2"] = merged["self"].shift(-2)
    merged = merged.fillna(False)
    merged["hypo_combination"] = merged["auto"] & (
        merged["hypoglycemia"] | merged["hypoglycemia+1"] | merged["hypoglycemia+2"]
    ) & (
        merged["self-1"] | merged["self-2"] | merged["self+1"] | merged["self+2"] | merged["self"]
    ) 

    merged["hypo_auto"] = merged["auto"] & (
        merged["hypoglycemia"] | merged["hypoglycemia+1"] | merged["hypoglycemia+2"]
    ) & ~(
        merged["self-1"] | merged["self-2"] | merged["self+1"] | merged["self+2"] | merged["self"]
    )

    merged["hypo_self"] = merged["self"] & (
        merged["hypoglycemia"] | merged["hypoglycemia+1"] | merged["hypoglycemia+2"]
    ) & ~merged["auto"]

    merged["hypo_other"] = ~merged["auto"] & merged["hypoglycemia"] & ~(
        merged["self-1"] | merged["self-2"] | merged["self+1"] | merged["self+2"] | merged["self"]
    )

    merged["hour"] = merged.index.hour // step * step
    merged = merged.groupby("hour")[
        ["hypo_combination", "hypo_auto", "hypo_self", "hypo_other"]
    ].sum()


    return [
        DataHypoglycemia(
            time=int(time * 60),
            measurements=MeasurementsHypoglycemia(
                combination=row["hypo_combination"],
                self_bolus=row["hypo_self"],
                auto_bolus=row["hypo_auto"],
                other=row["hypo_other"],
            )
        )
        for time, row in merged.iterrows()
    ]
    