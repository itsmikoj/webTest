import { ApiResponse } from "@/types/shared";

export interface Auth {
  email: string;
  full_name: string;
  access_token: string;
  refresh_token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RefreshResponse {
  refresh_token: string;
  expires_in: number;
  expires_at: string;
  token_type: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

export interface Update {
  email?: string;
  password?: string;
  full_name?: string;
  method: "email" | "apple";
}

export interface AuthResponse extends ApiResponse<Auth> {}
export interface UpdateResponse extends ApiResponse<Update> {}

export interface MetricsData {
  totalInstalls: number;
  totalSubscriptions: number;
  totalRevenue: number;
  conversionRate: number;
  installsChange: number;
  subscriptionsChange: number;
  revenueChange: number;
  conversionRateChange: number;
  avgRevenuePerUser: number;
}

export interface ChartDataPoint {
  date: string;
  installs: number;
  subscriptions: number;
  revenue: number;
}

export interface FilterState {
  appId: string | null;
  timeRange: "all times" | "today" | "7d" | "30d" | "90d" | "custom";
  platform: "all" | "ios" | "android";
  groupBy: "day" | "week" | "month";
  startDate: string | null;
  endDate: string | null;
}
