export type ApiResponse = {
  records: Record[];
};

type Record = {
  minute: number;
  measurements: {
    median: number;
    min: number;
    max: number;
    p10: number;
    p90: number;
    p25: number;
    p75: number;
  };
};
