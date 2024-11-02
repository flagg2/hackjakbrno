import { InsulinChart } from "@/components/demo-chart";
import { insulinStateCache } from "@/lib/queryParsers/insulin";
import { SearchParams } from "nuqs";
type DataPageProps = {
  searchParams: SearchParams;
};

export default async function DataPage({ searchParams }: DataPageProps) {
  const { insulin } = insulinStateCache.parse(searchParams);

  console.log({ insulin });

  return (
    <div className="container mx-auto mt-16">
      <InsulinChart />
    </div>
  );
}
