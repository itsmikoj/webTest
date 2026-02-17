import { api } from "@/lib/api/client";
import {
  TrackingLinksResponse,
  TrackingLink,
  CreateTrackingLinkData,
  UpdateTrackingLinkData,
} from "@/types/links";

export async function getTrackingLinksByAppTracker(
  appTrackerId: string,
): Promise<TrackingLink[]> {
  console.log("fetch tracking-links");
  const response = await api.get<TrackingLink[]>(
    `/app-tracker/${appTrackerId}/tracking-links`,
    {
      revalidate: 60,
      tags: ["tracking-links", appTrackerId],
    },
  );
  return response || [];
}

export async function createTrackingLink(
  appTrackerId: string,
  data: CreateTrackingLinkData,
): Promise<TrackingLink> {
  console.log("create tracking-link for app:", appTrackerId);
  const response = await api.post<TrackingLink>(
    `/app-tracker/${appTrackerId}/tracking-links`,
    data
  );
  return response;
}

export async function updateTrackingLink(
  linkId: string,
  data: UpdateTrackingLinkData,
): Promise<TrackingLink> {
  console.log("update tracking-link:", linkId);
  const response = await api.patch<TrackingLink>(
    `/tracking-links/${linkId}`,
    data,
  );
  return response;
}

export async function deleteTrackingLink(linkId: string): Promise<void> {
  console.log("delete tracking-link:", linkId);
  await api.delete(`/tracking-links/${linkId}`);
}
