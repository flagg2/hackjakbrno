import { HighestBolusInsulinDistributionChartParams } from "@/lib/queryParsers/highest-bolus-insulin-distribution";
import { formatDate } from "../utils";
import { getHighestBolusDosageDistribution } from "../myApi";

// Define the return type from the API
export type HighestBolusInsulinDistributionResponse = Awaited<
  ReturnType<typeof getHighestBolusDosageDistribution>
>["data"];

export async function fetchHighestBolusInsulinDistribution(
  params: { fileId: string },
  highestBolusInsulinDistribution: HighestBolusInsulinDistributionChartParams
) {
  const { data } = await getHighestBolusDosageDistribution({
    file_id: params.fileId,
    step_in_minutes: parseInt(
      highestBolusInsulinDistribution.dataInterval ?? "60"
    ),
    from_datetime: formatDate(highestBolusInsulinDistribution.from),
    to_datetime: formatDate(highestBolusInsulinDistribution.to),
    quantile: highestBolusInsulinDistribution.quantile,
  });

  return {
    data,
  };
}
