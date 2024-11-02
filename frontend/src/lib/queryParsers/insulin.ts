import { useQueryState } from "nuqs";
import { z } from "zod";
import { createSearchParamsCache, parseAsJson } from "nuqs/server";

export const insulinChartParamsSchema = z.object({
  dataInterval: z.enum(["30", "60", "120"]),
  bolusType: z.enum(["self-administered", "auto-administered", "all"]),
  from: z.coerce.date(),
  to: z.coerce.date(),
});

export type InsulinChartParams = z.infer<typeof insulinChartParamsSchema>;

export function useInsulinState() {
  return useQueryState("insulin", insulinParsers.insulin);
}

export const insulinParsers = {
  insulin: parseAsJson(insulinChartParamsSchema.parse)
    .withDefault({
      dataInterval: "60",
      bolusType: "all",
      from: new Date(0),
      to: new Date(),
    })
    .withOptions({ shallow: false }),
};

export const insulinStateCache = createSearchParamsCache(insulinParsers);
