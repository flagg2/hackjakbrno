from datetime import datetime
from enum import Enum
from typing import TypedDict

import pandas as pd


class Measurements(TypedDict):
    median: float
    mean: float
    min: float
    max: float
    q10: float
    q25: float
    q75: float
    q90: float


class Data(TypedDict):
    time: int
    measurements: Measurements


class Doze(Enum):
    AUTO = "AUTO"
    SELF = "SELF"
    ALL = "ALL"



def line_plot_glycemia(
    file: str, from_datetime: datetime, to_datetime: datetime, step: int
) -> list[Data]:
    df = pd.read_csv(file, header=1, index_col=0)
    df = df[["CGM Glucose Value (mmol/l)"]]
    df.index = pd.to_datetime(df.index)
    df = df.sort_index()
    df = df.loc[from_datetime:to_datetime]

    df["minute_of_day"] = (df.index.hour * 60 + df.index.minute) // step * step
    df_agg = df.groupby("minute_of_day")["CGM Glucose Value (mmol/l)"].agg(
        median="median",
        mean="mean",
        min="min",
        max="max",
        q10=lambda x: x.quantile(0.10),
        q25=lambda x: x.quantile(0.25),
        q75=lambda x: x.quantile(0.90),
        q90=lambda x: x.quantile(0.75),
    )

    return [
        Data(
            time=int(time),
            measurements=Measurements(
                median=row["median"],
                mean=row["mean"],
                min=row["min"],
                max=row["max"],
                q10=row["q10"],
                q25=row["q25"],
                q75=row["q75"],
                q90=row["q90"],
            )
        )
        for time, row in df_agg.iterrows()
    ]

def line_plot_bolus(
    file: str, from_datetime: datetime, to_datetime: datetime, step: int, doze: Doze
) -> list[Data]:
    df = pd.read_csv(file, header=1, index_col=0)
    df = df[["Carbs Input (g)", "Insulin Delivered (U)"]]
    df.index = pd.to_datetime(df.index)
    df = df.sort_index()
    df = df.loc[from_datetime:to_datetime]

    if doze == Doze.AUTO:
        df = df[df["Carbs Input (g)"] > 0.0]
    elif doze == Doze.SELF:
        df = df[df["Carbs Input (g)"] == 0.0]

    df["minute_of_day"] = (df.index.hour * 60 + df.index.minute) // step * step
    df_agg = df.groupby("minute_of_day")["Insulin Delivered (U)"].agg(
        median="median",
        mean="mean",
        min="min",
        max="max",
        q10=lambda x: x.quantile(0.10),
        q25=lambda x: x.quantile(0.25),
        q75=lambda x: x.quantile(0.90),
        q90=lambda x: x.quantile(0.75),
    )

    return [
        Data(
            time=int(time),
            measurements=Measurements(
                median=row["median"],
                mean=row["mean"],
                min=row["min"],
                max=row["max"],
                q10=row["q10"],
                q25=row["q25"],
                q75=row["q75"],
                q90=row["q90"],
            )
        )
        for time, row in df_agg.iterrows()
    ]


def line_plot_basal(
    file: str, from_datetime: datetime, to_datetime: datetime, step: int
) -> list[Data]:
    df = pd.read_csv(file, header=1, index_col=0)
    df = df[["Rate"]]
    df.index = pd.to_datetime(df.index)
    df = df[~df.index.duplicated(keep='first')]
    df = df.resample("min").ffill()
    df = df.loc[from_datetime:to_datetime]

    df["minute_of_day"] = (df.index.hour * 60 + df.index.minute) // step * step
    df_agg = df.groupby("minute_of_day")["Rate"].agg(
        median="median",
        mean="mean",
        min="min",
        max="max",
        q10=lambda x: x.quantile(0.10),
        q25=lambda x: x.quantile(0.25),
        q75=lambda x: x.quantile(0.90),
        q90=lambda x: x.quantile(0.75),
    )


    return [
        Data(
            time=int(time),
            measurements=Measurements(
                median=row["median"],
                mean=row["mean"],
                min=row["min"],
                max=row["max"],
                q10=row["q10"],
                q25=row["q25"],
                q75=row["q75"],
                q90=row["q90"],
            )
        )
        for time, row in df_agg.iterrows()
    ]
