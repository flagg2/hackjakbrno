"use client";

import React from "react";

import { InputLabel } from "./input-label";
import { BasalInsulinResponse } from "@/api/fetch/basalInsulin";
import { DatePicker } from "./ui/datepicker";

import { OptionSelect, SelectOption } from "./option-select";
import { InsulinChart } from "./insulin-chart";
import {
  BasalInsulinChartParams,
  useBasalInsulinState,
} from "@/lib/queryParsers/basalInsulin";

type InsulinChartProps = {
  response: BasalInsulinResponse;
};

export const BasalInsulinChart = ({ response }: InsulinChartProps) => {
  const [state, setState] = useBasalInsulinState();
  const interval = parseInt(state.dataInterval);

  const intervalOptions: SelectOption<
    BasalInsulinChartParams["dataInterval"]
  >[] = [
    { value: "30", label: "30 minutes" },
    { value: "60", label: "1 hour" },
    { value: "120", label: "2 hours" },
  ];

  //   const bolusTypeOptions: SelectOption<InsulinChartParams["bolusType"]>[] = [
  //     { value: "self-administered", label: "Self-administered" },
  //     { value: "auto-administered", label: "Auto-administered" },
  //     { value: "all", label: "All" },
  //   ];

  return (
    <div className="">
      <div className="">
        <h2 className="text-2xl font-bold mb-4">Basal Insulin Chart</h2>
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
            <OptionSelect<BasalInsulinChartParams["dataInterval"]>
              options={intervalOptions}
              defaultValue={state?.dataInterval ?? "15"}
              onValueChange={(value) =>
                setState({ ...state, dataInterval: value })
              }
            />
          </InputLabel>
          {/* <InputLabel label="Bolus type">
            <OptionSelect<InsulinChartParams["bolusType"]>
              options={bolusTypeOptions}
              defaultValue={state?.bolusType ?? "self-administered"}
              onValueChange={(value) =>
                setState({ ...state, bolusType: value })
              }
            />
          </InputLabel> */}
        </div>
      </div>
      <div style={{ width: "100%", height: "400px" }}>
        <InsulinChart
          data={response.data}
          interval={interval}
          yAxisLabel="Basal Insulin Level (U/h)"
        />
      </div>
    </div>
  );
};
