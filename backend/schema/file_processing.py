from pydantic import BaseModel
from backend.domain.line_plot import Data


class GlycemiaResponseBody(BaseModel):
    data: list[Data]