import { fetchBasalInsulin } from "@/api/fetch/basalInsulin";
import { InsulinChart } from "@/components/insulin-chart";
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
  console.log({ searchParams });
  const parsed = insulinStateCache.parse(searchParams);

  console.log({ parsed });

  const response = await fetchBasalInsulin(
    { fileId: params.fileId },
    parsed.insulin
  );

  //   console.log({ response });

  return (
    <div className="container mx-auto mt-16">
      <InsulinChart response={response} />
    </div>
  );
}
