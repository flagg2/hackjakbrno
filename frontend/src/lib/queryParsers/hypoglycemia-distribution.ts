import { useQueryState } from "nuqs";
import { z } from "zod";
import { createSearchParamsCache, parseAsJson } from "nuqs/server";

export const hypoglycemiaDistributionChartParamsSchema = z.object({
  dataInterval: z.enum(["60", "120"]),
  from: z.coerce.date(),
  to: z.coerce.date(),
});

export type HypoglycemiaDistributionChartParams = z.infer<
  typeof hypoglycemiaDistributionChartParamsSchema
>;

export function useHypoglycemiaDistributionState() {
  return useQueryState(
    "hypoglycemiaDistribution",
    hypoglycemiaDistributionParsers.hypoglycemiaDistribution
  );
}

export const hypoglycemiaDistributionParsers = {
  hypoglycemiaDistribution: parseAsJson(
    hypoglycemiaDistributionChartParamsSchema.parse
  )
    .withDefault({
      dataInterval: "60",
      from: new Date(0),
      to: new Date(),
    })
    .withOptions({ shallow: false }),
};

export const hypoglycemiaDistributionStateCache = createSearchParamsCache(
  hypoglycemiaDistributionParsers
);
