import { useQueryState } from "nuqs";
import { z } from "zod";
import { createSearchParamsCache, parseAsJson } from "nuqs/server";

export const insulinChartParamsSchema = z.object({
  timePeriod: z.enum(["last7", "last30", "last90"]).default("last7"),
  dataInterval: z.enum(["15", "30", "60"]).default("15"),
  bolusType: z
    .enum(["self-administered", "auto-administered", "all"])
    .default("self-administered"),
});

export type InsulinChartParams = z.infer<typeof insulinChartParamsSchema>;

export function useInsulinState() {
  return useQueryState("insulinChartParams", parsers.insulin);
}

const parsers = { insulin: parseAsJson(insulinChartParamsSchema.parse) };

export const insulinStateCache = createSearchParamsCache(parsers);
