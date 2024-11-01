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

const colors = {
  median: "#0060AC",
  p2575: "#B5D1FF",
  p1090: "#DFE9FF",
  minmax: "#0060AC",
};

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

export const DemoChart = () => {
  const [timePeriod, setTimePeriod] = useState("last7");
  return (
    <div className="">
      <div className="ml-16">
        <h2 className="text-2xl font-bold mb-2">Glucose Chart</h2>
        <div className="flex items-center gap-2  mb-4">
          <label className="text-sm font-bold">Time period</label>
          <Select
            defaultValue="last7"
            onValueChange={(value) => setTimePeriod(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="last 7 days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7">Last 7 days</SelectItem>
              <SelectItem value="last30">Last 30 days</SelectItem>
              <SelectItem value="last90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
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
            <Tooltip />

            {/* P10-P90 Area (Bottom Layer) */}
            <Area
              type="monotone"
              dataKey="p1090"
              stroke="none"
              fill={colors.p1090}
              fillOpacity={0.5}
              activeDot={false}
              baseLine={0}
            />

            {/* P25-P75 Area (Middle Layer) */}
            <Area
              type="monotone"
              dataKey="p2575"
              stroke="none"
              fill={colors.p2575}
              fillOpacity={0.7}
              activeDot={false}
            />

            {/* Min and Max Lines */}
            <Line
              type="monotone"
              dataKey="min"
              stroke={colors.minmax}
              strokeDasharray="3 3"
              strokeWidth={1}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="max"
              stroke={colors.minmax}
              strokeDasharray="3 3"
              strokeWidth={1}
              dot={false}
            />

            {/* Median Line (Top Layer) */}
            <Line
              type="monotone"
              dataKey="median"
              stroke={colors.median}
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
