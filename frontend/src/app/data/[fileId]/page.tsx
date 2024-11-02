import { fetchBasalInsulin } from "@/api/fetch/basalInsulin";
import { fetchBolusInsulin } from "@/api/fetch/bolusInsulin";
import { fetchGlycemia } from "@/api/fetch/glycemia";
import { fetchInsulinDistribution } from "@/api/fetch/insulin-distribution";
import { BasalInsulinChart } from "@/components/charts/basal-insulin-chart";
import { BolusInsulinChart } from "@/components/charts/bolus-insulin-chart";
import { GlycemiaChart } from "@/components/charts/glycemia-chart";
import { InsulinDistributionChart } from "@/components/charts/insulin-distribution-chart";
import { basalInsulinStateCache } from "@/lib/queryParsers/basalInsulin";
import { bolusInsulinStateCache } from "@/lib/queryParsers/bolusInsulin";
import { glycemiaStateCache } from "@/lib/queryParsers/glycemia";
import { insulinDistributionStateCache } from "@/lib/queryParsers/insulin-distribution";
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
  const insulinDistributionParsed =
    insulinDistributionStateCache.parse(searchParams);

  const [
    basalResponse,
    bolusResponse,
    glycemiaResponse,
    insulinDistributionResponse,
  ] = await Promise.all([
    fetchBasalInsulin({ fileId: params.fileId }, basalParsed.basalInsulin),
    fetchBolusInsulin({ fileId: params.fileId }, bolusParsed.bolusInsulin),
    fetchGlycemia({ fileId: params.fileId }, glycemiaParsed.glycemia),
    fetchInsulinDistribution(
      { fileId: params.fileId },
      insulinDistributionParsed.insulinDistribution
    ),
  ]);

  //   console.log({ response });
  return (
    <div className="container mx-auto mt-16">
      <BasalInsulinChart response={basalResponse} />
      <BolusInsulinChart response={bolusResponse} />
      <GlycemiaChart response={glycemiaResponse} />
      <InsulinDistributionChart
        response={{
          ...insulinDistributionResponse,
          min_timestamp: basalResponse.min_timestamp,
          max_timestamp: basalResponse.max_timestamp,
        }}
      />
    </div>
  );
}
