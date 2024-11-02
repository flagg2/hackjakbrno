import { useQueryState } from "nuqs";
import { z } from "zod";
import { createSearchParamsCache, parseAsJson } from "nuqs/server";

export const insulinChartParamsSchema = z.object({
  dataInterval: z.enum(["15", "30", "60"]),
  bolusType: z.enum(["self-administered", "auto-administered", "all"]),
  from: z.coerce.date(),
  to: z.coerce.date(),
});

export type InsulinChartParams = z.infer<typeof insulinChartParamsSchema>;

export function useInsulinState() {
  return useQueryState("insulinChartParams", insulinParsers.insulin);
}

export const insulinParsers = {
  insulin: parseAsJson(insulinChartParamsSchema.parse).withDefault({
    dataInterval: "15",
    bolusType: "all",
    from: new Date(),
    to: new Date(),
  }),
};

export const insulinStateCache = createSearchParamsCache(insulinParsers);
