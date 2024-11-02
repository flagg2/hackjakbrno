import { useQueryState } from "nuqs";
import { z } from "zod";
import { createSearchParamsCache, parseAsJson } from "nuqs/server";

export const glycemiaChartParamsSchema = z.object({
  dataInterval: z.enum(["30", "60", "120"]),
  from: z.coerce.date(),
  to: z.coerce.date(),
});

export type GlycemiaChartParams = z.infer<typeof glycemiaChartParamsSchema>;

export function useGlycemiaState() {
  return useQueryState("glycemia", glycemiaParsers.glycemia);
}

export const glycemiaParsers = {
  glycemia: parseAsJson(glycemiaChartParamsSchema.parse)
    .withDefault({
      dataInterval: "60",
      from: new Date(0),
      to: new Date(),
    })
    .withOptions({ shallow: false }),
};

export const glycemiaStateCache = createSearchParamsCache(glycemiaParsers);
