import { ApiResponse } from "./shared";

export interface TrackingLink {
  id: string;
  app_tracker_id: string;
  campaign_id: string | null;
  adset_id: string | null;
  ad_id: string | null;
  link_name: string;
  custom_params: Record<string, any>;
  clicks_count: number;
  installs_count: number;
  created_at: string;
  updated_at: string;
  tracking_url?: string;
  app_tracker?: {
    id: string;
    app_name: string;
    bundle_id: string;
    app_store_url: string;
    play_store_url: string;
    deep_link_scheme: string;
    fallback_url: string;
  };
}

export interface CreateTrackingLinkData {
  campaign_id?: string;
  adset_id?: string;
  ad_id?: string;
  link_name: string;
  custom_params?: Record<string, any>;
}

export interface UpdateTrackingLinkData {
  campaign_id?: string;
  adset_id?: string;
  ad_id?: string;
  link_name?: string;
  custom_params?: Record<string, any>;
}

export type TrackingLinksResponse = ApiResponse<TrackingLink[]>;
export type TrackingLinkResponse = ApiResponse<TrackingLink>;
