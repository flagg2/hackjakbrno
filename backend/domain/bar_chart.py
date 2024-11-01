from dataclasses import dataclass
from datetime import datetime

import pandas as pd


@dataclass
class Measurements:
    basal: float
    auto_bolus: float
    self_bolus: float


@dataclass
class Data:
    time: int
    measurements: Measurements


def aggreate_df(df: pd.DataFrame, step: int) -> pd.DataFrame:
    df["round_timestamp"] = df.index.round("h")

    df = df.groupby("round_timestamp").sum()
    df["hour_of_day"] = df.index.hour // step * step

    df = df.groupby("hour_of_day").mean()
    df = df.reindex(pd.Index(range(24), name='hour_of_day'), fill_value=0)

    return df


def bar_chart(
    file_basal: str,
    file_bolus: str,
    from_datetime: datetime,
    to_datetime: datetime,
    step: int,
) -> list[Data]:
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
        Data(
            time=int(time),
            measurements=Measurements(
                basal=basal.loc[time, "Insulin Delivered (U)"],
                auto_bolus=auto_bolus.loc[time, "Insulin Delivered (U)"],
                self_bolus=self_bolus.loc[time, "Insulin Delivered (U)"],
            )
        )
        for time in range(0, 24, step)
    ]
