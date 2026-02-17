import { ApiResponse, StatusType } from "@/types/shared";

export interface User {
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  lastLogin: string;
}

export interface App {
  id: string;
  name: string;
  bundleId: string;
  logo?: string;
  status: StatusType;
  createdAt: string;
  userId: string;
}

export interface AppTracker {
  id: string;
  app_name: string;
  bundle_id: string;
  created_at: string;
  user_id: string;
}

export interface Install {
  id: string;
  app_tracker_id: string;
  created_at: string;
  event_id: string;
  event_name: string;
  timestamp: number;
  platform: string;
  app_bundle_id: string;
  app_version: string;
  app_build: string;
  device_idfv: string;
  device_os_version: string;
  device_locale: string;
  device_model: string;
  device_timezone: string;
  device_idfa: string;
  privacy_att_status: boolean;
}

export interface SuperwallEvent {
  id: string;
  app_tracker_id: string;
  event_type: string;
  event_name: string;
  superwall_event_id: string;
  application_id: number;
  application_name: string;
  project_id: number;
  bundle_id: string;
  environment: string;
  store: string;
  original_app_user_id: string;
  product_id: string;
  period_type: string;
  currency_code: string;
  price: number;
  proceeds: number;
  purchased_at: string;
  expiration_at: string;
  created_at: string;
}

export interface AppTrackerResponse extends ApiResponse<AppTracker[]> {}
export interface InstallResponse extends ApiResponse<Install[]> {}
export interface SuperwallEventResponse extends ApiResponse<SuperwallEvent[]> {}
