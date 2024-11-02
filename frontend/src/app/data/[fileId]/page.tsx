import { getBasalInsulinGetBasalInsulinGet } from "@/api/myApi";
import { InsulinChart } from "@/components/demo-chart";
import { insulinStateCache } from "@/lib/queryParsers/insulin";
import { SearchParams } from "nuqs";
type DataPageProps = {
  searchParams: SearchParams;
  params: {
    fileId: string;
  };
};

function getFromToDatetime(lastDays: "last7" | "last30" | "last90") {
  const now = new Date();
  const date = new Date(
    now.setDate(
      now.getDate() -
        (lastDays === "last7" ? 7 : lastDays === "last30" ? 30 : 90)
    )
  );
  return {
    from_datetime: date.toISOString(),
    to_datetime: now.toISOString(),
  };
}

export default async function DataPage({
  searchParams,
  params,
}: DataPageProps) {
  const { insulin } = insulinStateCache.parse(searchParams);

  console.log({ insulin });

  const { data } = await getBasalInsulinGetBasalInsulinGet({
    file_id: params.fileId,
    step: parseInt(insulin?.dataInterval ?? "60"),
    ...getFromToDatetime(insulin?.timePeriod ?? "last7"),
  });

  console.log({ data });

  return (
    <div className="container mx-auto mt-16">
      <InsulinChart />
    </div>
  );
}
