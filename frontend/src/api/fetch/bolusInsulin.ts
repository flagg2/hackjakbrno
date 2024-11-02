import { getBolusInsulin } from "../myApi";
import { formatDate } from "../utils";
import { BolusInsulinChartParams } from "@/lib/queryParsers/bolusInsulin";

// Define the return type from the API
export type BolusInsulinResponse = Awaited<
  ReturnType<typeof getBolusInsulin>
>["data"];

export async function fetchBolusInsulin(
  params: { fileId: string },
  insulin: BolusInsulinChartParams
) {
  //   console.log({
  //     file_id: params.fileId,
  //     step: parseInt(insulin?.dataInterval ?? "60"),
  //     from_datetime: insulin?.from,
  //     to_datetime: insulin?.to,
  //   });
  const { data, status } = await getBolusInsulin({
    file_id: params.fileId,
    step_in_minutes: parseInt(insulin.dataInterval ?? "60"),
    from_datetime: formatDate(insulin.from),
    to_datetime: formatDate(insulin.to),
    dose: insulin.type,
  });

  return data;
}
