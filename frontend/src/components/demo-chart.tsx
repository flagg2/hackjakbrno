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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { InputLabel } from "./input-label";
import { useQueryState } from "nuqs";
import { chartColors } from "@/const/colors";
import { ChartTooltip } from "./chart-tooltip";
import { BasalInsulinResponse } from "@/api/fetch/basalInsulin";
import { DatePicker } from "./ui/datepicker";
import {
  InsulinChartParams,
  insulinChartParamsSchema,
  insulinParsers,
} from "@/lib/queryParsers/insulin";

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

type InsulinChartProps = {
  response: BasalInsulinResponse;
};

export const InsulinChart = ({ response }: InsulinChartProps) => {
  const [params, setParams] = useQueryState(
    "chartParams",
    insulinParsers.insulin
  );

  const chartData = response.data.map(({ time, measurements }) => ({
    time,
    min: measurements.min,
    max: measurements.max,
    median: measurements.median,
    p1090: [measurements.q10, measurements.q90] as [number, number],
    p2575: [measurements.q25, measurements.q75] as [number, number],
  }));

  const intervalOptions: SelectOption<InsulinChartParams["dataInterval"]>[] = [
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "60", label: "1 hour" },
  ];

  const bolusTypeOptions: SelectOption<InsulinChartParams["bolusType"]>[] = [
    { value: "self-administered", label: "Self-administered" },
    { value: "auto-administered", label: "Auto-administered" },
    { value: "all", label: "All" },
  ];

  return (
    <div className="">
      <div className="">
        <h2 className="text-2xl font-bold mb-4">Glucose Chart</h2>
        <div className="flex items-center gap-4  mb-4">
          <InputLabel label="From">
            <DatePicker
              date={params?.from}
              //   fromDate={response.min_timestamp}
              setDate={(date) =>
                setParams({ ...params, from: date ?? new Date(0) })
              }
            />
          </InputLabel>
          <InputLabel label="To">
            <DatePicker
              date={params?.to}
              setDate={(date) =>
                setParams({ ...params, to: date ?? new Date() })
              }
            />
          </InputLabel>

          <InputLabel label="Data interval">
            <OptionSelect<InsulinChartParams["dataInterval"]>
              options={intervalOptions}
              defaultValue={params?.dataInterval ?? "15"}
              onValueChange={(value) =>
                setParams({ ...params, dataInterval: value })
              }
            />
          </InputLabel>
          <InputLabel label="Bolus type">
            <OptionSelect<InsulinChartParams["bolusType"]>
              options={bolusTypeOptions}
              defaultValue={params?.bolusType ?? "self-administered"}
              onValueChange={(value) =>
                setParams({ ...params, bolusType: value })
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
