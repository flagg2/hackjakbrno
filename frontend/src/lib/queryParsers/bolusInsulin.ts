import { useQueryState } from "nuqs";
import { z } from "zod";
import { createSearchParamsCache, parseAsJson } from "nuqs/server";

export const bolusInsulinChartParamsSchema = z.object({
  dataInterval: z.enum(["30", "60", "120"]),
  type: z.enum(["self", "carbs", "auto", "all"]),
  from: z.coerce.date(),
  to: z.coerce.date(),
});

export type BolusInsulinChartParams = z.infer<
  typeof bolusInsulinChartParamsSchema
>;

export function useBolusInsulinState() {
  return useQueryState("bolusInsulin", bolusInsulinParsers.bolusInsulin);
}

export const bolusInsulinParsers = {
  bolusInsulin: parseAsJson(bolusInsulinChartParamsSchema.parse)
    .withDefault({
      dataInterval: "60",
      type: "all",
      from: new Date(0),
      to: new Date(),
    })
    .withOptions({ shallow: false }),
};

export const bolusInsulinStateCache =
  createSearchParamsCache(bolusInsulinParsers);
