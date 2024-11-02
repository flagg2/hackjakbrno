"use client";

import React from "react";
import { InputLabel } from "../input-label";
import { HypoglycemiaDistributionResponse } from "@/api/fetch/hypoglycemia-distribution";
import { DatePicker } from "../ui/datepicker";
import { OptionSelect, SelectOption } from "../option-select";
import { HypoglycemiaDistributionChartContent } from "./content/hypoglycemia-chart";

import { endOfDay, max } from "date-fns";
import {
  HypoglycemiaDistributionChartParams,
  useHypoglycemiaDistributionState,
} from "@/lib/queryParsers/hypoglycemia-distribution";

type HypoglycemiaChartProps = {
  response: HypoglycemiaDistributionResponse;
};

export const HypoglycemiaChart = ({
  response,
}: HypoglycemiaChartProps & {}) => {
  const [state, setState] = useHypoglycemiaDistributionState();
  const interval = parseInt(state.dataInterval);

  const intervalOptions: SelectOption<
    HypoglycemiaDistributionChartParams["dataInterval"]
  >[] = [
    //  { value: "30", label: "30 minutes" },
    { value: "60", label: "1 hour" },
    { value: "120", label: "2 hours" },
  ];

  // Transform the data for each measurement type
  const transformData = (
    measurementType: keyof HypoglycemiaDistributionResponse["data"][0]["measurement"]
  ) => {
    return response.data.map((item) => ({
      time: item.time,
      count: item.measurement[measurementType],
    }));
  };

  return (
    <div className="">
      <div className="">
        <h2 className="text-2xl font-bold mb-4">Hypoglycemia Distribution</h2>
        <div className="flex items-center gap-4 mb-4">
          <InputLabel label="From">
            <DatePicker
              date={state?.from}
              fromDate={new Date(response.min_timestamp)}
              toDate={new Date(response.max_timestamp)}
              setDate={(date) =>
                setState({ ...state, from: date ?? new Date(0) })
              }
            />
          </InputLabel>
          <InputLabel label="To">
            <DatePicker
              date={state?.to}
              fromDate={max([new Date(response.min_timestamp), state.from])}
              toDate={new Date(response.max_timestamp)}
              setDate={(date) =>
                setState({ ...state, to: date ? endOfDay(date) : new Date() })
              }
            />
          </InputLabel>

          <InputLabel label="Data interval">
            <OptionSelect<HypoglycemiaDistributionChartParams["dataInterval"]>
              options={intervalOptions}
              defaultValue={state?.dataInterval ?? "60"}
              onValueChange={(value) =>
                setState({ ...state, dataInterval: value })
              }
            />
          </InputLabel>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4" style={{ height: "800px" }}>
        <HypoglycemiaDistributionChartContent
          data={transformData("combination")}
          interval={interval}
          yAxisLabel="Combination Count"
        />
        <HypoglycemiaDistributionChartContent
          data={transformData("self_bolus")}
          interval={interval}
          yAxisLabel="Self Bolus Count"
        />
        <HypoglycemiaDistributionChartContent
          data={transformData("auto_bolus")}
          interval={interval}
          yAxisLabel="Auto Bolus Count"
        />
        <HypoglycemiaDistributionChartContent
          data={transformData("other")}
          interval={interval}
          yAxisLabel="Other Count"
        />
      </div>
    </div>
  );
};
