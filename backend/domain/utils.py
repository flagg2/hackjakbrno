from datetime import datetime

import pandas as pd


def extreme_timestamps(file: str) -> tuple[datetime, datetime]:
    df = pd.read_csv(file, header=1, index_col=0)
    return df.index.min(), df.index.max()


def duplicites(file: str) -> int:
    df = pd.read_csv(file, header=1, index_col=0)
    return df.index.duplicated().sum()
