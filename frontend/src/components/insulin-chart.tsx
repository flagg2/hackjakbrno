"use client";

import React from "react";
import {
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";

import { InputLabel } from "./input-label";
import { chartColors } from "@/const/colors";
import { ChartTooltip } from "./chart-tooltip";
import { BasalInsulinResponse } from "@/api/fetch/basalInsulin";
import { DatePicker } from "./ui/datepicker";
import {
  InsulinChartParams,
  useInsulinState,
} from "@/lib/queryParsers/insulin";
import { OptionSelect, SelectOption } from "./option-select";

type InsulinChartProps = {
  response: BasalInsulinResponse;
};

export const InsulinChart = ({ response }: InsulinChartProps) => {
  const [state, setState] = useInsulinState();
  const interval = parseInt(state.dataInterval);

  const data = [
    response.data[0],
    ...response.data.map((d) => ({
      ...d,
      time: d.time + interval,
    })),
  ];

  const chartData = data.map(({ time, measurements }) => {
    const timeInHours = time / 60;

    return {
      time: timeInHours,
      min: measurements.min,
      max: measurements.max,
      median: measurements.median,
      p1090: [measurements.q10, measurements.q90] as [number, number],
      p2575: [measurements.q25, measurements.q75] as [number, number],
    };
  });

  const intervalOptions: SelectOption<InsulinChartParams["dataInterval"]>[] = [
    { value: "30", label: "30 minutes" },
    { value: "60", label: "1 hour" },
    { value: "120", label: "2 hours" },
  ];

  const bolusTypeOptions: SelectOption<InsulinChartParams["bolusType"]>[] = [
    { value: "self-administered", label: "Self-administered" },
    { value: "auto-administered", label: "Auto-administered" },
    { value: "all", label: "All" },
  ];

  return (
    <div className="">
      <div className="">
        <h2 className="text-2xl font-bold mb-4">Insulin Chart</h2>
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
            <OptionSelect<InsulinChartParams["dataInterval"]>
              options={intervalOptions}
              defaultValue={state?.dataInterval ?? "15"}
              onValueChange={(value) =>
                setState({ ...state, dataInterval: value })
              }
            />
          </InputLabel>
          <InputLabel label="Bolus type">
            <OptionSelect<InsulinChartParams["bolusType"]>
              options={bolusTypeOptions}
              defaultValue={state?.bolusType ?? "self-administered"}
              onValueChange={(value) =>
                setState({ ...state, bolusType: value })
              }
            />
          </InputLabel>
        </div>
      </div>
      <div style={{ width: "100%", height: "400px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
          >
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <XAxis
              dataKey="time"
              label={{
                value: "Time (hours)",
                position: "insideBottom",
                offset: -5,
              }}
              domain={[0, 24]}
              ticks={Array.from({ length: 25 }, (_, i) => i)}
              type="number"
              allowDataOverflow={true}
              tickFormatter={(value) => {
                const hours = Math.floor(value);
                const minutes = Math.round((value % 1) * 60);
                return minutes === 0
                  ? `${hours}h`
                  : `${hours}:${minutes.toString().padStart(2, "0")}`;
              }}
            />
            <YAxis
              label={{
                value: "Insulin Level (U/h)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              content={(props) => {
                const time = props.payload?.[0]?.payload?.time;
                if (time === undefined) return null;
                return (
                  <ChartTooltip
                    {...props}
                    timeMinutes={time * 60}
                    timeIntervalMinutes={interval}
                  />
                );
              }}
            />

            {/* P10-P90 Area (Bottom Layer) */}
            <Area
              type="monotone"
              dataKey="p1090"
              stroke="none"
              fill={chartColors.p1090}
              fillOpacity={0.5}
              activeDot={false}
              baseLine={0}
            />

            {/* P25-P75 Area (Middle Layer) */}
            <Area
              type="monotone"
              dataKey="p2575"
              stroke="none"
              fill={chartColors.p2575}
              fillOpacity={0.7}
              activeDot={false}
            />

            {/* Min and Max Lines */}
            <Line
              type="monotone"
              dataKey="min"
              stroke={chartColors.minmax}
              strokeDasharray="3 3"
              strokeWidth={1}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="max"
              stroke={chartColors.minmax}
              strokeDasharray="3 3"
              strokeWidth={1}
              dot={false}
            />

            {/* Median Line (Top Layer) */}
            <Line
              type="monotone"
              dataKey="median"
              stroke={chartColors.median}
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
