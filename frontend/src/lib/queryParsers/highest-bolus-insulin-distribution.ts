import { useQueryState } from "nuqs";
import { z } from "zod";
import { createSearchParamsCache, parseAsJson } from "nuqs/server";

export const highestBolusInsulinDistributionChartParamsSchema = z.object({
  dataInterval: z.enum(["60", "120"]),
  from: z.coerce.date(),
  to: z.coerce.date(),
  quantile: z.number().min(0).max(1),
});

export type HighestBolusInsulinDistributionChartParams = z.infer<
  typeof highestBolusInsulinDistributionChartParamsSchema
>;

export function useHighestBolusInsulinDistributionState() {
  return useQueryState(
    "highestBolusInsulinDistribution",
    highestBolusInsulinDistributionParsers.highestBolusInsulinDistribution
  );
}

export const highestBolusInsulinDistributionParsers = {
  highestBolusInsulinDistribution: parseAsJson(
    highestBolusInsulinDistributionChartParamsSchema.parse
  )
    .withDefault({
      dataInterval: "60",
      from: new Date(0),
      to: new Date(),
      quantile: 0.8,
    })
    .withOptions({ shallow: false }),
};

export const highestBolusInsulinDistributionStateCache =
  createSearchParamsCache(highestBolusInsulinDistributionParsers);
