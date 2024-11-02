import { getDosageDistribution } from "../myApi";
import { formatDate } from "../utils";
// import { get } from "../myApi";
import { InsulinDistributionChartParams } from "@/lib/queryParsers/insulin-distribution";

// Define the return type from the API
export type InsulinDistributionResponse = Awaited<
  ReturnType<typeof getDosageDistribution>
>["data"];

export async function fetchInsulinDistribution(
  params: { fileId: string },
  insulinDistribution: InsulinDistributionChartParams
) {
  const { data } = await getDosageDistribution({
    file_id: params.fileId,
    step_in_minutes: parseInt(insulinDistribution.dataInterval ?? "60"),
    from_datetime: formatDate(insulinDistribution.from),
    to_datetime: formatDate(insulinDistribution.to),
  });

  return {
    data: data.data.map((d) => ({
      ...d,
      time: d.time * 60,
    })),
  };
}
