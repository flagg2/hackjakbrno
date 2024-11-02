import { GlycemiaChartParams } from "@/lib/queryParsers/glycemia";
import { getGlycemia } from "../myApi";
import { formatDate } from "../utils";

// Define the return type from the API
export type GlycemiaResponse = Awaited<ReturnType<typeof getGlycemia>>["data"];

export async function fetchGlycemia(
  params: { fileId: string },
  glycemia: GlycemiaChartParams
) {
  const { data } = await getGlycemia({
    file_id: params.fileId,
    step_in_minutes: parseInt(glycemia.dataInterval ?? "60"),
    from_datetime: formatDate(glycemia.from),
    to_datetime: formatDate(glycemia.to),
  });

  return data;
}
