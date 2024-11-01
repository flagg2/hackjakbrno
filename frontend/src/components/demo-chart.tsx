import React, { useState } from "react";
import {
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { InputLabel } from "./input-label";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { chartColors } from "@/const/colors";
import { ChartTooltip } from "./chart-tooltip";

const data = [
  {
    time: 0,
    min: 5,
    p10: 6,
    p25: 7,
    median: 8,
    p75: 9,
    p90: 10,
    max: 11,
    p1090: [6, 10],
    p2575: [7, 9],
  },
  {
    time: 3,
    min: 5.5,
    p10: 6.5,
    p25: 7.5,
    median: 8.5,
    p75: 9.5,
    p90: 10.5,
    max: 11.5,
    p1090: [6.5, 10.5],
    p2575: [7.5, 9.5],
  },
  {
    time: 6,
    min: 5.3,
    p10: 6.2,
    p25: 7.2,
    median: 8.2,
    p75: 9.2,
    p90: 10.2,
    max: 11.2,
    p1090: [6.2, 10.2],
    p2575: [7.2, 9.2],
  },
  {
    time: 9,
    min: 5.1,
    p10: 6.1,
    p25: 7.1,
    median: 8.1,
    p75: 9.1,
    p90: 10.1,
    max: 11.1,
    p1090: [6.1, 10.1],
    p2575: [7.1, 9.1],
  },
  {
    time: 12,
    min: 5.0,
    p10: 6.0,
    p25: 7.0,
    median: 8.0,
    p75: 9.0,
    p90: 10.0,
    max: 11.0,
    p1090: [6.0, 10.0],
    p2575: [7.0, 9.0],
  },
  {
    time: 15,
    min: 5.2,
    p10: 6.2,
    p25: 7.2,
    median: 8.2,
    p75: 9.2,
    p90: 10.2,
    max: 11.2,
    p1090: [6.2, 10.2],
    p2575: [7.2, 9.2],
  },
  {
    time: 18,
    min: 5.4,
    p10: 6.4,
    p25: 7.4,
    median: 8.4,
    p75: 9.4,
    p90: 10.4,
    max: 11.4,
    p1090: [6.4, 10.4],
    p2575: [7.4, 9.4],
  },
  {
    time: 21,
    min: 5.6,
    p10: 6.6,
    p25: 7.6,
    median: 8.6,
    p75: 9.6,
    p90: 10.6,
    max: 11.6,
    p1090: [6.6, 10.6],
    p2575: [7.6, 9.6],
  },
  {
    time: 22,
    min: 5.0,
    p10: 6.0,
    p25: 7.0,
    median: 8.0,
    p75: 9.0,
    p90: 10.0,
    max: 11.0,
    p1090: [6.0, 10.0],
    p2575: [7.0, 9.0],
  },
  {
    time: 24,
    min: 5.8,
    p10: 6.8,
    p25: 7.8,
    median: 8.8,
    p75: 9.8,
    p90: 10.8,
    max: 11.8,
    p1090: [6.8, 10.8],
    p2575: [7.8, 9.8],
  },
];

type SelectOption<T extends string> = {
  value: T;
  label: string;
};

interface OptionSelectProps<T extends string> {
  options: SelectOption<T>[];
  defaultValue: T;
  onValueChange: (value: T) => void;
}

const OptionSelect = <T extends string>({
  options,
  defaultValue,
  onValueChange,
}: OptionSelectProps<T>) => (
  <Select defaultValue={defaultValue} onValueChange={onValueChange}>
    <SelectTrigger className="w-[180px] mt-1">
      <SelectValue
        placeholder={options.find((opt) => opt.value === defaultValue)?.label}
      />
    </SelectTrigger>
    <SelectContent>
      {options.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export const DemoChart = () => {
  const [timePeriod, setTimePeriod] = useQueryState(
    "timePeriod",
    parseAsStringEnum(["last7", "last30", "last90"]).withDefault("last7")
  );

  const [dataInterval, setDataInterval] = useQueryState(
    "dataInterval",
    parseAsStringEnum(["15", "30", "60"]).withDefault("15")
  );

  const [bolusType, setBolusType] = useQueryState(
    "bolusType",
    parseAsStringEnum([
      "self-administered",
      "auto-administered",
      "all",
    ]).withDefault("self-administered")
  );

  const timeRangeOptions: SelectOption<"last7" | "last30" | "last90">[] = [
    { value: "last7", label: "Last 7 days" },
    { value: "last30", label: "Last 30 days" },
    { value: "last90", label: "Last 90 days" },
  ];

  const intervalOptions: SelectOption<"15" | "30" | "60">[] = [
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "60", label: "1 hour" },
  ];

  const bolusTypeOptions: SelectOption<
    "self-administered" | "auto-administered" | "all"
  >[] = [
    { value: "self-administered", label: "Self-administered" },
    { value: "auto-administered", label: "Auto-administered" },
    { value: "all", label: "All" },
  ];

  return (
    <div className="">
      <div className="">
        <h2 className="text-2xl font-bold mb-4">Glucose Chart</h2>
        <div className="flex items-center gap-4  mb-4">
          <InputLabel label="Time period">
            <OptionSelect<"last7" | "last30" | "last90">
              options={timeRangeOptions}
              defaultValue="last7"
              onValueChange={setTimePeriod}
            />
          </InputLabel>
          <InputLabel label="Data interval">
            <OptionSelect<"15" | "30" | "60">
              options={intervalOptions}
              defaultValue="15"
              onValueChange={setDataInterval}
            />
          </InputLabel>
          <InputLabel label="Bolus type">
            <OptionSelect<"self-administered" | "auto-administered" | "all">
              options={bolusTypeOptions}
              defaultValue="self-administered"
              onValueChange={setBolusType}
            />
          </InputLabel>
        </div>
      </div>
      <div style={{ width: "100%", height: "400px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
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
            />
            <YAxis
              label={{
                value: "Glucose Level (mmol/L)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip content={<ChartTooltip />} />

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
