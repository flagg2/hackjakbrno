"use client";

import React from "react";
import { max } from "date-fns";

import { InputLabel } from "../input-label";
import { DatePicker } from "../ui/datepicker";

import { OptionSelect, SelectOption } from "../option-select";
import { StreamChartContent } from "./content/stream-chart";
import {
  BolusInsulinChartParams,
  useBolusInsulinState,
} from "@/lib/queryParsers/bolusInsulin";
import { BolusInsulinResponse } from "@/api/fetch/bolusInsulin";

type InsulinChartProps = {
  response: BolusInsulinResponse;
};

export const BolusInsulinChart = ({ response }: InsulinChartProps) => {
  const [state, setState] = useBolusInsulinState();
  const interval = parseInt(state.dataInterval);

  const intervalOptions: SelectOption<
    BolusInsulinChartParams["dataInterval"]
  >[] = [
    { value: "30", label: "30 minutes" },
    { value: "60", label: "1 hour" },
    { value: "120", label: "2 hours" },
  ];

  const bolusTypeOptions: SelectOption<BolusInsulinChartParams["type"]>[] = [
    { value: "self", label: "Self-administered - without carbs" },
    { value: "carbs", label: "Self-administered - with carbs" },
    { value: "auto", label: "Auto-administered" },
    { value: "all", label: "All" },
  ];

  return (
    <div className="">
      <div className="">
        <h2 className="text-2xl font-bold mb-4">Bolus Insulin Chart</h2>
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
              setDate={(date) => setState({ ...state, to: date ?? new Date() })}
            />
          </InputLabel>

          <InputLabel label="Data interval">
            <OptionSelect<BolusInsulinChartParams["dataInterval"]>
              options={intervalOptions}
              defaultValue={state?.dataInterval ?? "15"}
              onValueChange={(value) =>
                setState({ ...state, dataInterval: value })
              }
            />
          </InputLabel>
          <InputLabel label="Bolus type">
            <OptionSelect<BolusInsulinChartParams["type"]>
              options={bolusTypeOptions}
              defaultValue={state?.type ?? "self"}
              onValueChange={(value) => setState({ ...state, type: value })}
            />
          </InputLabel>
        </div>
      </div>
      <div style={{ width: "100%", height: "400px" }}>
        <StreamChartContent
          data={response.data}
          interval={interval}
          yAxisLabel="Bolus Insulin Level (U)"
        />
      </div>
    </div>
  );
};
