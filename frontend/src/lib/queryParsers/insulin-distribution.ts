import { useQueryState } from "nuqs";
import { z } from "zod";
import { createSearchParamsCache, parseAsJson } from "nuqs/server";

export const insulinDistributionChartParamsSchema = z.object({
  dataInterval: z.enum(["60", "120"]),
  from: z.coerce.date(),
  to: z.coerce.date(),
});

export type InsulinDistributionChartParams = z.infer<
  typeof insulinDistributionChartParamsSchema
>;

export function useInsulinDistributionState() {
  return useQueryState(
    "insulinDistribution",
    insulinDistributionParsers.insulinDistribution
  );
}

export const insulinDistributionParsers = {
  insulinDistribution: parseAsJson(insulinDistributionChartParamsSchema.parse)
    .withDefault({
      dataInterval: "60",
      from: new Date(0),
      to: new Date(),
    })
    .withOptions({ shallow: false }),
};

export const insulinDistributionStateCache = createSearchParamsCache(
  insulinDistributionParsers
);
