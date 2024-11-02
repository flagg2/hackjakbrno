import { InsulinChartParams } from "@/lib/queryParsers/insulin";
import { getBasalInsulin } from "../myApi";
import { formatDate } from "../utils";

// Define the return type from the API
export type BasalInsulinData = Awaited<
  ReturnType<typeof getBasalInsulin>
>["data"]["data"];

export async function fetchBasalInsulin(
  params: { fileId: string },
  insulin?: InsulinChartParams
) {
  console.log({
    file_id: params.fileId,
    step: parseInt(insulin?.dataInterval ?? "60"),
    ...getFromToDatetime(insulin?.timePeriod ?? "last7"),
  });
  const {
    data: { data },
    status,
  } = await getBasalInsulin({
    file_id: params.fileId,
    step: parseInt(insulin?.dataInterval ?? "60"),
    ...getFromToDatetime(insulin?.timePeriod ?? "last7"),
  });

  console.log({ status });

  return data;
}

function getFromToDatetime(lastDays: "last7" | "last30" | "last90") {
  const now = new Date();
  const date = new Date(now);
  date.setDate(
    date.getDate() -
      (lastDays === "last7" ? 7 : lastDays === "last30" ? 30 : 90)
  );

  return {
    from_datetime: formatDate(date),
    to_datetime: formatDate(now),
  };
}
