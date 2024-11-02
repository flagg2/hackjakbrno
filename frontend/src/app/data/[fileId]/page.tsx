import { fetchBasalInsulin } from "@/api/fetch/basalInsulin";
import { fetchBolusInsulin } from "@/api/fetch/bolusInsulin";
import { fetchGlycemia } from "@/api/fetch/glycemia";
import { fetchHighestBolusInsulinDistribution } from "@/api/fetch/highest-bolus-insulin-distribution";
import { fetchHypoglycemiaDistribution } from "@/api/fetch/hypoglycemia-distribution";
import { fetchInsulinDistribution } from "@/api/fetch/insulin-distribution";
import { BasalInsulinChart } from "@/components/charts/basal-insulin-chart";
import { BolusInsulinChart } from "@/components/charts/bolus-insulin-chart";
import { GlycemiaChart } from "@/components/charts/glycemia-chart";
import { HighestBolusInsulinDistributionChart } from "@/components/charts/highest-bolus-insulin-distribution";
import { HypoglycemiaChart } from "@/components/charts/hypoglycemia-chart";
import { InsulinDistributionChart } from "@/components/charts/insulin-distribution-chart";
import { basalInsulinStateCache } from "@/lib/queryParsers/basalInsulin";
import { bolusInsulinStateCache } from "@/lib/queryParsers/bolusInsulin";
import { glycemiaStateCache } from "@/lib/queryParsers/glycemia";
import { highestBolusInsulinDistributionStateCache } from "@/lib/queryParsers/highest-bolus-insulin-distribution";
import { hypoglycemiaDistributionStateCache } from "@/lib/queryParsers/hypoglycemia-distribution";
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
  const highestBolusInsulinDistributionParsed =
    highestBolusInsulinDistributionStateCache.parse(searchParams);
  const hypoglycemiaDistributionParsed =
    hypoglycemiaDistributionStateCache.parse(searchParams);

  console.log({ searchParams });
  const insulinDistributionParsed =
    insulinDistributionStateCache.parse(searchParams);

  console.log({ hypoglycemiaDistributionParsed });

  const [
    basalResponse,
    bolusResponse,
    glycemiaResponse,
    insulinDistributionResponse,
    highestBolusInsulinDistributionResponse,
    hypoglycemiaDistributionResponse,
  ] = await Promise.all([
    fetchBasalInsulin({ fileId: params.fileId }, basalParsed.basalInsulin),
    fetchBolusInsulin({ fileId: params.fileId }, bolusParsed.bolusInsulin),
    fetchGlycemia({ fileId: params.fileId }, glycemiaParsed.glycemia),
    fetchInsulinDistribution(
      { fileId: params.fileId },
      insulinDistributionParsed.insulinDistribution
    ),
    fetchHighestBolusInsulinDistribution(
      { fileId: params.fileId },
      highestBolusInsulinDistributionParsed.highestBolusInsulinDistribution
    ),
    fetchHypoglycemiaDistribution(
      { fileId: params.fileId },
      hypoglycemiaDistributionParsed.hypoglycemiaDistribution
    ),
  ]);

  console.log({ dd: highestBolusInsulinDistributionResponse.data.data });
  return (
    <div className="container mx-auto mt-16">
      <BasalInsulinChart response={basalResponse} />
      <BolusInsulinChart response={bolusResponse} />
      <GlycemiaChart response={glycemiaResponse} />
      <InsulinDistributionChart
        response={{
          ...insulinDistributionResponse.data,
          min_timestamp: basalResponse.min_timestamp,
          max_timestamp: basalResponse.max_timestamp,
        }}
      />
      <HighestBolusInsulinDistributionChart
        response={{
          ...highestBolusInsulinDistributionResponse.data,
          min_timestamp: basalResponse.min_timestamp,
          max_timestamp: basalResponse.max_timestamp,
        }}
      />
      <HypoglycemiaChart response={hypoglycemiaDistributionResponse} />
    </div>
  );
}
