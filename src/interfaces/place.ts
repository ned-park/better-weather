export interface Place {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code?: string;
  country_code?: string;
  admin1_id?: number;
  timezone?: string;
  population?: number | null;
  country_id?: number;
  country?: string;
  admin1: string;
  admin2_id?: number | null;
  postcodes?: (string)[] | null;
  admin2?: string | null;
  admin3_id?: number | null;
  admin3?: string | null;
}