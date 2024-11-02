"use client";

import React from "react";

import { InputLabel } from "../input-label";
import { DatePicker } from "../ui/datepicker";

import { OptionSelect, SelectOption } from "../option-select";
import { InsulinDistributionChartParams } from "@/lib/queryParsers/insulin-distribution";
import { endOfDay, max } from "date-fns";
import {
  HighestBolusInsulinDistributionChartParams,
  useHighestBolusInsulinDistributionState,
} from "@/lib/queryParsers/highest-bolus-insulin-distribution";
import { HighestBolusInsulinDistributionResponse } from "@/api/fetch/highest-bolus-insulin-distribution";
import { HighestBolusBarChartContent } from "./content/highest-bolus-bar-chart";
import { Input } from "../ui/input";
import { useDebounce } from "@/lib/hooks/useDebounce";

type HighestBolusInsulinDistributionChartProps = {
  response: HighestBolusInsulinDistributionResponse & {
    min_timestamp: string;
    max_timestamp: string;
  };
};

export const HighestBolusInsulinDistributionChart = ({
  response,
}: HighestBolusInsulinDistributionChartProps) => {
  const [state, setState] = useHighestBolusInsulinDistributionState();
  const interval = parseInt(state.dataInterval);

  const intervalOptions: SelectOption<
    HighestBolusInsulinDistributionChartParams["dataInterval"]
  >[] = [
    //  { value: "30", label: "30 minutes" },
    { value: "60", label: "1 hour" },
    { value: "120", label: "2 hours" },
  ];

  console.log({ ss: response.data });

  const handleQuantileChange = useDebounce(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      const boundedValue = Math.min(Math.max(value, 0), 1);
      setState({ ...state, quantile: boundedValue });
    },
    300
  );

  return (
    <div className="">
      <div className="">
        <h2 className="text-2xl font-bold mb-4">
          Highest Bolus Distribution Chart
        </h2>
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
              fromDate={max([new Date(response.min_timestamp), state.from])}
              toDate={new Date(response.max_timestamp)}
              setDate={(date) =>
                setState({ ...state, to: date ? endOfDay(date) : new Date() })
              }
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
          <InputLabel label="Quantile">
            <Input
              type="number"
              defaultValue="0.8"
              max={1}
              step={0.01}
              min={0}
              onChange={handleQuantileChange}
            />
          </InputLabel>
        </div>
      </div>
      <div style={{ width: "100%", height: "400px" }}>
        <HighestBolusBarChartContent
          data={response.data}
          interval={interval}
          yAxisLabel="Percentage"
        />
      </div>
    </div>
  );
};
