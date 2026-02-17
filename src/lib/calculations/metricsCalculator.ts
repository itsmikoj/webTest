import { Install, SuperwallEvent, FilterState } from "@/types";

export interface InstallStats {
  totalInstalls: number;
  platforms: Record<string, number>;
  topCountries: Record<string, number>;
  attRate: number;
  appVersions: Record<string, number>;
  latestVersion: string;
}

export function calculateInstallMetrics(installs: Install[]): InstallStats {
  const platforms = installs.reduce(
    (acc, install) => {
      acc[install.platform] = (acc[install.platform] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const topCountries = installs.reduce(
    (acc, install) => {
      acc[install.device_timezone] = (acc[install.device_timezone] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const totalWithATT = installs.filter((i) => i.privacy_att_status).length;
  const attRate =
    installs.length > 0 ? (totalWithATT / installs.length) * 100 : 0;

  const appVersions = installs.reduce(
    (acc, install) => {
      const version = install.app_version || "Unknown";
      acc[version] = (acc[version] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const latestVersion =
    Object.entries(appVersions).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "Unknown";

  return {
    totalInstalls: installs.length,
    platforms,
    topCountries,
    attRate,
    appVersions,
    latestVersion,
  };
}

export function calculatePercentageChange(
  current: number,
  previous: number,
): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}
