import { fetchBasalInsulin } from "@/api/fetch/basalInsulin";
import { InsulinChart } from "@/components/demo-chart";
import { insulinStateCache } from "@/lib/queryParsers/insulin";
import { SearchParams } from "nuqs";
type DataPageProps = {
  searchParams: SearchParams;
  params: {
    fileId: string;
  };
};

export default async function DataPage({
  searchParams,
  params,
}: DataPageProps) {
  const { insulin } = insulinStateCache.parse(searchParams);

  const data = await fetchBasalInsulin({ fileId: params.fileId }, insulin);

  console.log({ data });

  return (
    <div className="container mx-auto mt-16">
      <InsulinChart data={data} />
    </div>
  );
}
