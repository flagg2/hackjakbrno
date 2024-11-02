type TooltipPayloadItem = {
  value?: unknown;
  dataKey?: string | number;
  color?: string;
  name?: string;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  timeMinutes: number;
  timeIntervalMinutes: number;
};

const StatisticLine = ({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) => (
  <p className="flex items-center">
    <span
      className="inline-block mr-2"
      style={{
        backgroundColor: color,
        width: "12px",
        height: "12px",
      }}
    />
    {`${label}: ${value.toFixed(2)} U`}
  </p>
);

function formatTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes.toString().padStart(2, "0")}min`;
}

export const DistributionTooltip = ({
  active,
  payload,
  timeMinutes,
  timeIntervalMinutes,
}: CustomTooltipProps) => {
  if (!active || !payload) return null;

  const timeLabelStart = formatTime(timeMinutes - timeIntervalMinutes);
  const timeLabelEnd = formatTime(timeMinutes);

  return (
    <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
      <p className="font-medium mb-1">
        Time: {timeLabelStart} - {timeLabelEnd}
      </p>
      {payload.map((item) => (
        <StatisticLine
          key={item.dataKey as string}
          color={item.color ?? "#000"}
          label={item.name ?? (item.dataKey as string)}
          value={item.value as number}
        />
      ))}
    </div>
  );
};
