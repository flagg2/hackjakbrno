import { chartColors } from "@/const/colors";

type CustomTooltipProps = {
  active?: boolean;
  tooltip: number;
  tooltipLabel: string;
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
    {`${label}: ${value?.toFixed(2)}`}
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

export const HypoglycemiaDistributionTooltip = ({
  active,
  tooltip,
  tooltipLabel,
  timeMinutes,
  timeIntervalMinutes,
}: CustomTooltipProps) => {
  if (!active) return null;

  const timeLabelStart = formatTime(timeMinutes - timeIntervalMinutes);
  const timeLabelEnd = formatTime(timeMinutes);

  return (
    <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
      <p className="font-medium mb-1">
        Time: {timeLabelStart} - {timeLabelEnd}
      </p>
      <StatisticLine
        color={chartColors.basal}
        label={tooltipLabel}
        value={tooltip}
      />
    </div>
  );
};
