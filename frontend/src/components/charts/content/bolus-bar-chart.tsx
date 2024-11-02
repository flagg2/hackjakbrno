"use client";

import React from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  TooltipProps,
} from "recharts";

import { chartColors } from "@/const/colors";
import { ChartTooltip } from "../tooltips/stream-tooltip";
import { InsulinDistributionResponse } from "@/api/fetch/insulin-distribution";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

type InsulinChartProps = {
  data: InsulinDistributionResponse["data"];
  interval: number;
  yAxisLabel: string;
  tooltipContent?: (
    props: TooltipProps<ValueType, NameType>
  ) => React.ReactNode;
};

export const BarChartContent = ({
  data,
  interval,
  yAxisLabel,
  tooltipContent,
}: InsulinChartProps) => {
  const xAxisLabel = "Time (hours)";
  const augmentedData = [
    ...data.map((d) => ({
      ...d,
      time: interval === 120 ? d.time + interval - 60 : d.time + interval,
    })),
  ];

  const chartData = augmentedData.map(({ time = 0, measurements }) => {
    const timeInHours = time / 60;

    return {
      time: timeInHours,
      selfBolus: measurements.self_bolus,
      autoBolus: measurements.auto_bolus,
      basal: measurements.basal,
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
            dy: 40,
          }}
        />
        <Tooltip
          content={
            tooltipContent ??
            ((props) => {
              const time = props.payload?.[0]?.payload?.time;
              if (time === 0) return null;
              return (
                <ChartTooltip
                  {...props}
                  timeMinutes={time * 60 + (interval === 120 ? 60 : 0)}
                  timeIntervalMinutes={interval}
                />
              );
            })
          }
        />

        {/* Replace the Area and Line components with these Bar components */}
        <Bar
          dataKey="basal"
          stackId="insulin"
          fill={chartColors.basal}
          name="Basal"
        />
        <Bar
          dataKey="autoBolus"
          stackId="insulin"
          fill={chartColors.autoBolus}
          name="Auto Bolus"
        />
        <Bar
          dataKey="selfBolus"
          stackId="insulin"
          fill={chartColors.selfBolus}
          name="Self Bolus"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
