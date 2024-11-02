/**
 * Generated by orval v7.2.0 🍺
 * Do not edit manually.
 * Pump Perfect
 * OpenAPI spec version: 0.1.0
 */
export type GetBolusInsulinParams = {
file_id: string;
from_datetime: string;
to_datetime: string;
step?: number;
dose?: Dose;
};

export type GetBasalInsulinParams = {
file_id: string;
from_datetime: string;
to_datetime: string;
step?: number;
};

export type GetGlycemiaParams = {
file_id: string;
from_datetime: string;
to_datetime: string;
step?: number;
};

export type ValidationErrorLocItem = string | number;

export interface ValidationError {
  loc: ValidationErrorLocItem[];
  msg: string;
  type: string;
}

export interface UploadZipResponseBody {
  file_id: string;
}

export interface MeasurementsResponseBody {
  max: number;
  mean: number;
  median: number;
  min: number;
  q10: number;
  q25: number;
  q75: number;
  q90: number;
}

export interface HTTPValidationError {
  detail?: ValidationError[];
}

export interface GlycemiaResponseBody {
  data: DataResponseBody[];
}

export type Dose = typeof Dose[keyof typeof Dose];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Dose = {
  auto: 'auto',
  self: 'self',
  all: 'all',
} as const;

export interface DataResponseBody {
  measurements: MeasurementsResponseBody;
  time: number;
}

export interface BolusInsulinResponseBody {
  data: DataResponseBody[];
}

export interface BodyUploadZip {
  file: Blob;
}

export interface BasalInsulinResponseBody {
  data: DataResponseBody[];
}



/**
 * @summary Upload Zip
 */
export type uploadZipResponse = {
  data: UploadZipResponseBody;
  status: number;
}

export const getUploadZipUrl = () => {


  return `http://localhost:8000/upload-zip`
}

export const uploadZip = async (bodyUploadZip: BodyUploadZip, options?: RequestInit): Promise<uploadZipResponse> => {
    const formData = new FormData();
formData.append('file', bodyUploadZip.file)

  const res = await fetch(getUploadZipUrl(),
  {      
    ...options,
    method: 'POST'
    ,
    body: 
      formData,
  }

  )
  const data = await res.json()

  return { status: res.status, data }
}



/**
 * @summary Get Glycemia
 */
export type getGlycemiaResponse = {
  data: GlycemiaResponseBody;
  status: number;
}

export const getGetGlycemiaUrl = (params: GetGlycemiaParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : value.toString())
    }
  });

  return normalizedParams.size ? `http://localhost:8000/get-glycemia?${normalizedParams.toString()}` : `http://localhost:8000/get-glycemia`
}

export const getGlycemia = async (params: GetGlycemiaParams, options?: RequestInit): Promise<getGlycemiaResponse> => {
  
  const res = await fetch(getGetGlycemiaUrl(params),
  {      
    ...options,
    method: 'GET'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data }
}



/**
 * @summary Get Basal Insulin
 */
export type getBasalInsulinResponse = {
  data: BasalInsulinResponseBody;
  status: number;
}

export const getGetBasalInsulinUrl = (params: GetBasalInsulinParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : value.toString())
    }
  });

  return normalizedParams.size ? `http://localhost:8000/get-basal-insulin?${normalizedParams.toString()}` : `http://localhost:8000/get-basal-insulin`
}

export const getBasalInsulin = async (params: GetBasalInsulinParams, options?: RequestInit): Promise<getBasalInsulinResponse> => {
  
  const res = await fetch(getGetBasalInsulinUrl(params),
  {      
    ...options,
    method: 'GET'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data }
}



/**
 * @summary Get Bolus Insulin
 */
export type getBolusInsulinResponse = {
  data: BolusInsulinResponseBody;
  status: number;
}

export const getGetBolusInsulinUrl = (params: GetBolusInsulinParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : value.toString())
    }
  });

  return normalizedParams.size ? `http://localhost:8000/get-bolus-insulin?${normalizedParams.toString()}` : `http://localhost:8000/get-bolus-insulin`
}

export const getBolusInsulin = async (params: GetBolusInsulinParams, options?: RequestInit): Promise<getBolusInsulinResponse> => {
  
  const res = await fetch(getGetBolusInsulinUrl(params),
  {      
    ...options,
    method: 'GET'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data }
}



