import { HypoglycemiaDistributionChartParams } from "@/lib/queryParsers/hypoglycemia-distribution";
import { getHypoglycemiaDistribution } from "../myApi";
import { formatDate } from "../utils";

// Define the return type from the API
export type HypoglycemiaDistributionResponse = Awaited<
  ReturnType<typeof getHypoglycemiaDistribution>
>["data"];

export async function fetchHypoglycemiaDistribution(
  params: { fileId: string },
  hypoglycemiaDistribution: HypoglycemiaDistributionChartParams
) {
  const { data } = await getHypoglycemiaDistribution({
    file_id: params.fileId,
    step_in_minutes: parseInt(hypoglycemiaDistribution.dataInterval ?? "60"),
    from_datetime: formatDate(hypoglycemiaDistribution.from),
    to_datetime: formatDate(hypoglycemiaDistribution.to),
  });

  return data;
}
