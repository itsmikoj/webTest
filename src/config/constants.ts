const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BACKEND_URL) {
  throw new Error(
    "One or more environment variables are missing. Please check your .env file.\n" +
      "Required variables: NEXT_PUBLIC_API_URL",
  );
}

export const ROUTES = {
  dashboard: "/dashboard",
  login: "/login",
  settings: "/settings",
  users: "/users",
  installs: "/dashboard/installs",
  subscriptions: "/dashboard/subscriptions",
  links: "/dashboard/links",
} as const;

export const STORAGE_KEYS = {
  user: "__user_profile_data",
  app: "__app_metadata",
  token: "__Secure-app_session",
  refresh: "__Host-rt",
  mode: "__display_type_switch"
} 

export const CHART_COLORS = {
  installs: "#3b82f6",
  subscriptions: "#6366f1",
  revenue: "#22c55e",
  conversionRate: "#f59e0b",
} as const;

export const FILTER_OPTIONS = {
  timeRanges: [
    { value: "all times", label: "All Times" },
    { value: "today", label: "Today" },
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
  ],
  platforms: [
    { value: "all", label: "All Platforms" },
    { value: "ios", label: "iOS" },
    { value: "android", label: "Android" },
  ],
  groupBy: [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
  ],
} as const;

export { BACKEND_URL };
