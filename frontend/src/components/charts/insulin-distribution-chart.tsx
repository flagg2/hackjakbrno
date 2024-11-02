"use client";

import React from "react";

import { InputLabel } from "../input-label";
import { DatePicker } from "../ui/datepicker";

import { OptionSelect, SelectOption } from "../option-select";
import {
  InsulinDistributionChartParams,
  useInsulinDistributionState,
} from "@/lib/queryParsers/insulin-distribution";
import { InsulinDistributionResponse } from "@/api/fetch/insulin-distribution";
import { BarChart } from "./bar-chart";

type InsulinDistributionChartProps = {
  response: InsulinDistributionResponse & {
    min_timestamp: string;
    max_timestamp: string;
  };
};

export const InsulinDistributionChart = ({
  response,
}: InsulinDistributionChartProps) => {
  const [state, setState] = useInsulinDistributionState();
  const interval = parseInt(state.dataInterval);

  const intervalOptions: SelectOption<
    InsulinDistributionChartParams["dataInterval"]
  >[] = [
    //  { value: "30", label: "30 minutes" },
    { value: "60", label: "1 hour" },
    { value: "120", label: "2 hours" },
  ];

  console.log({ response: response.data });

  return (
    <div className="">
      <div className="">
        <h2 className="text-2xl font-bold mb-4">Glycemia Chart</h2>
        <div className="flex items-center gap-4  mb-4">
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
              fromDate={new Date(response.min_timestamp)}
              toDate={new Date(response.max_timestamp)}
              setDate={(date) => setState({ ...state, to: date ?? new Date() })}
            />
          </InputLabel>

          <InputLabel label="Data interval">
            <OptionSelect<InsulinDistributionChartParams["dataInterval"]>
              options={intervalOptions}
              defaultValue={state?.dataInterval ?? "15"}
              onValueChange={(value) =>
                setState({ ...state, dataInterval: value })
              }
            />
          </InputLabel>
        </div>
      </div>
      <div style={{ width: "100%", height: "400px" }}>
        <BarChart
          data={response.data}
          interval={interval}
          yAxisLabel="Blood Glucose Level (mg/dL)"
        />
      </div>
    </div>
  );
};
