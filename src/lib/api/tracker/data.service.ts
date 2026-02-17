import { api } from "@/lib/api/client";
import { SuperwallEventResponse, SuperwallEvent } from "@/types";
import { InstallResponse, Install } from "@/types";
import { AppTrackerResponse, AppTracker } from "@/types";

export async function getAppTrackers(): Promise<AppTracker[]> {
  console.log("fetch app-tracker");
  const response = await api.get<AppTrackerResponse>("/app-tracker", {
    revalidate: 300,
    tags: ["app-trackers"],
  });
  return response.data;
}

export async function getInstallsByAppTracker(
  appTrackerId: string,
): Promise<Install[]> {
  console.log("fetch install");
  const response = await api.get<InstallResponse>(
    `/install/app-tracker/${appTrackerId}`,
  );
  return response.data;
}

export async function getSubscriptionsByAppTracker(
  appTrackerId: string,
): Promise<SuperwallEvent[]> {
  console.log("fetch suscriptions");
  const response = await api.get<SuperwallEventResponse>(
    `/webhooks/superwall/app-tracker/${appTrackerId}`,
  );
  return response.data;
}
