import { fetchBasalInsulin } from "@/api/fetch/basalInsulin";
import { fetchBolusInsulin } from "@/api/fetch/bolusInsulin";
import { BasalInsulinChart } from "@/components/basal-insulin-chart";
import { BolusInsulinChart } from "@/components/bolus-insulin-chart";
import { basalInsulinStateCache } from "@/lib/queryParsers/basalInsulin";
import { bolusInsulinStateCache } from "@/lib/queryParsers/bolusInsulin";
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
  const basalParsed = basalInsulinStateCache.parse(searchParams);
  const bolusParsed = bolusInsulinStateCache.parse(searchParams);

  const basalResponse = await fetchBasalInsulin(
    { fileId: params.fileId },
    basalParsed.basalInsulin
  );
  const bolusResponse = await fetchBolusInsulin(
    { fileId: params.fileId },
    bolusParsed.bolusInsulin
  );

  console.log(basalResponse.data);

  //   console.log({ response });
  return (
    <div className="container mx-auto mt-16">
      <BasalInsulinChart response={basalResponse} />
      <BolusInsulinChart response={bolusResponse} />
    </div>
  );
}
