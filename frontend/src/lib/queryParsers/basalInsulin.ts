import { useQueryState } from "nuqs";
import { z } from "zod";
import { createSearchParamsCache, parseAsJson } from "nuqs/server";

export const basalInsulinChartParamsSchema = z.object({
  dataInterval: z.enum(["30", "60", "120"]),
  from: z.coerce.date(),
  to: z.coerce.date(),
});

export type BasalInsulinChartParams = z.infer<
  typeof basalInsulinChartParamsSchema
>;

export function useBasalInsulinState() {
  return useQueryState("basalInsulin", basalInsulinParsers.basalInsulin);
}

export const basalInsulinParsers = {
  basalInsulin: parseAsJson(basalInsulinChartParamsSchema.parse)
    .withDefault({
      dataInterval: "60",
      from: new Date(0),
      to: new Date(),
    })
    .withOptions({ shallow: false }),
};

export const basalInsulinStateCache =
  createSearchParamsCache(basalInsulinParsers);
