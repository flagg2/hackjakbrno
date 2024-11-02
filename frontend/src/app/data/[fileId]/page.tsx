import { fetchBasalInsulin } from "@/api/fetch/basalInsulin";
import { fetchBolusInsulin } from "@/api/fetch/bolusInsulin";
import { fetchGlycemia } from "@/api/fetch/glycemia";
import { BasalInsulinChart } from "@/components/basal-insulin-chart";
import { BolusInsulinChart } from "@/components/bolus-insulin-chart";
import { GlycemiaChart } from "@/components/glycemia-chart";
import { basalInsulinStateCache } from "@/lib/queryParsers/basalInsulin";
import { bolusInsulinStateCache } from "@/lib/queryParsers/bolusInsulin";
import { glycemiaStateCache } from "@/lib/queryParsers/glycemia";
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
  const glycemiaParsed = glycemiaStateCache.parse(searchParams);

  const [basalResponse, bolusResponse, glycemiaResponse] = await Promise.all([
    fetchBasalInsulin({ fileId: params.fileId }, basalParsed.basalInsulin),
    fetchBolusInsulin({ fileId: params.fileId }, bolusParsed.bolusInsulin),
    fetchGlycemia({ fileId: params.fileId }, glycemiaParsed.glycemia),
  ]);

  console.log(glycemiaResponse.data);

  //   console.log({ response });
  return (
    <div className="container mx-auto mt-16">
      <BasalInsulinChart response={basalResponse} />
      <BolusInsulinChart response={bolusResponse} />
      {/* <GlycemiaChart response={glycemiaResponse} /> */}
    </div>
  );
}
