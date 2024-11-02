import { InsulinChartParams } from "@/lib/queryParsers/insulin";
import { getBasalInsulin } from "../myApi";
import { formatDate } from "../utils";

// Define the return type from the API
export type BasalInsulinResponse = Awaited<
  ReturnType<typeof getBasalInsulin>
>["data"];

export async function fetchBasalInsulin(
  params: { fileId: string },
  insulin: InsulinChartParams
) {
  //   console.log({
  //     file_id: params.fileId,
  //     step: parseInt(insulin?.dataInterval ?? "60"),
  //     from_datetime: insulin?.from,
  //     to_datetime: insulin?.to,
  //   });
  const { data, status } = await getBasalInsulin({
    file_id: params.fileId,
    step_in_minutes: parseInt(insulin.dataInterval ?? "60"),
    from_datetime: formatDate(insulin.from),
    to_datetime: formatDate(insulin.to),
  });

  return data;
}
