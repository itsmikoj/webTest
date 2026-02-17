import useSWR from "swr";
import { TrackingLink } from "@/types";
import {
  getInstallMetrics,
  getSubscriptionMetrics,
} from "@/lib/api/tracker/metrics.service";
import {
  getTrackingLinksByAppTracker,
  createTrackingLink,
  updateTrackingLink,
  deleteTrackingLink,
} from "@/lib/api/tracker/links.service";
import { CreateTrackingLinkData, UpdateTrackingLinkData } from "@/types/links";

export function useDashboardData(appTrackerId: string | null) {
  const shouldFetch = Boolean(appTrackerId);

  const {
    data: installData,
    isLoading: isLoadingInstalls,
    mutate: mutateInstalls,
  } = useSWR(
    shouldFetch ? ["installs", appTrackerId] : null,
    () => getInstallMetrics(appTrackerId!),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000,
    },
  );

  const {
    data: subscriptionData,
    isLoading: isLoadingSubscriptions,
    mutate: mutateSubscriptions,
  } = useSWR(
    shouldFetch ? ["subscriptions", appTrackerId] : null,
    () => getSubscriptionMetrics(appTrackerId!),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000,
    },
  );

  const {
    data: linksData,
    isLoading: isLoadingLinks,
    mutate: mutateLinks,
  } = useSWR(
    shouldFetch ? ["links", appTrackerId] : null,
    () => getTrackingLinksByAppTracker(appTrackerId!),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000,
    },
  );

  const refetch = () => {
    mutateInstalls();
    mutateSubscriptions();
    mutateLinks();
  };

  const createLink = async (data: CreateTrackingLinkData) => {
    if (!appTrackerId) return;
    const newLink = await createTrackingLink(appTrackerId, data);
    mutateLinks(
      (prev: TrackingLink[] | undefined) =>
        prev ? [...prev, newLink] : [newLink],
      false,
    );
    return newLink;
  };

  const updateLink = async (linkId: string, data: UpdateTrackingLinkData) => {
    const updatedLink = await updateTrackingLink(linkId, data);
    mutateLinks(
      (prev: TrackingLink[] | undefined) =>
        prev?.map((link) => (link.id === linkId ? updatedLink : link)),
      false,
    );
    return updatedLink;
  };

  const deleteLink = async (linkId: string) => {
    await deleteTrackingLink(linkId);
    mutateLinks(
      (prev: TrackingLink[] | undefined) =>
        prev?.filter((link) => link.id !== linkId),
      false,
    );
  };

  return {
    installs: installData?.allInstalls || [],
    subscriptions: subscriptionData?.allSubscriptions || [],
    links: linksData || [],
    isLoading: isLoadingInstalls || isLoadingSubscriptions || isLoadingLinks,
    refetch,
    createLink,
    updateLink,
    deleteLink,
  };
}
