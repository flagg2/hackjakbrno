import { chartColors } from "@/const/colors";

type TooltipPayloadItem = {
  value: unknown;
  dataKey: string;
  color: string;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
};

type StatisticLineProps = {
  color: string;
  label: string;
  value: number | undefined;
};

const StatisticLine = ({ color, label, value }: StatisticLineProps) => (
  <p className="flex items-center">
    <span
      className="inline-block mr-2"
      style={{
        backgroundColor: color,
        width: "12px",
        height: "12px",
      }}
    />
    {`${label}: ${value}`}
  </p>
);

export const ChartTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
  if (!active || !payload) return null;

  // Find the p2575 and p1090 arrays
  const p2575Array = payload.find((p) => p.dataKey === "p2575")
    ?.value as number[];
  const p1090Array = payload.find((p) => p.dataKey === "p1090")
    ?.value as number[];

  return (
    <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
      <p className="font-medium">{`Time: ${label}h`}</p>
      <StatisticLine
        color={chartColors.median}
        label="Median"
        value={payload.find((p) => p.dataKey === "median")?.value as number}
      />
      <StatisticLine
        color={chartColors.p2575}
        label="75th percentile"
        value={p2575Array?.[1]} // Second element is p75
      />
      <StatisticLine
        color={chartColors.p2575}
        label="25th percentile"
        value={p2575Array?.[0]} // First element is p25
      />
      <StatisticLine
        color={chartColors.p1090}
        label="90th percentile"
        value={p1090Array?.[1]} // Second element is p90
      />
      <StatisticLine
        color={chartColors.p1090}
        label="10th percentile"
        value={p1090Array?.[0]} // First element is p10
      />
      <StatisticLine
        color={chartColors.minmax}
        label="Maximum"
        value={payload.find((p) => p.dataKey === "max")?.value as number}
      />
      <StatisticLine
        color={chartColors.minmax}
        label="Minimum"
        value={payload.find((p) => p.dataKey === "min")?.value as number}
      />
    </div>
  );
};
