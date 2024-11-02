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

import { chartColors } from "@/const/colors";
import { ChartTooltip } from "./chart-tooltip";
import { BasalInsulinResponse } from "@/api/fetch/basalInsulin";
import { BolusInsulinResponse } from "@/api/fetch/bolusInsulin";

type InsulinChartProps = {
  data: BasalInsulinResponse["data"] | BolusInsulinResponse["data"];
  interval: number;
  yAxisLabel: string;
};

export const InsulinChart = ({
  data,
  interval,
  yAxisLabel,
}: InsulinChartProps) => {
  const xAxisLabel = "Time (hours)";
  const augmentedData = [
    data[0],
    ...data.map((d) => ({
      ...d,
      time: d.time + interval,
    })),
  ];

  const chartData = augmentedData.map(({ time, measurements }) => {
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
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={chartData}
        margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis
          dataKey="time"
          label={{
            value: xAxisLabel,
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
            value: yAxisLabel,
            angle: -90,
            position: "insideLeft",
          }}
        />
        <Tooltip
          content={(props) => {
            const time = props.payload?.[0]?.payload?.time;
            if (time === 0) return null;
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
  );
};
