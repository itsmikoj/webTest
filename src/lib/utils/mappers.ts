import { AppTracker, App } from "@/types";

function getImagePathByBundleId(bundle_id: string): string {
  const imagesPaths: Record<string, string> = {
    "com.beyondbrandsllc.christisking": "/christ.webp"
  }
  
  return imagesPaths[bundle_id]
}

export function mapAppTrackerToApp(appTracker: AppTracker): App {
  return {
    id: appTracker.id,
    name: appTracker.app_name,
    bundleId: appTracker.bundle_id,
    createdAt: appTracker.created_at,
    userId: appTracker.user_id,
    logo: getImagePathByBundleId(appTracker.bundle_id),
    status: "active" as const,
  };
}

export function mapAppTrackersToApps(appTrackers: AppTracker[]): App[] {
  return appTrackers.map(mapAppTrackerToApp);
}
