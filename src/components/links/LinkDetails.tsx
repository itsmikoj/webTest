import { TrackingLink } from "@/types/links";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { DetailsCard, DetailSection } from "@/components/ui/DetailsCard";
import { MousePointerClick, Download, TrendingUp, Target } from "lucide-react";

interface LinkDetailsProps {
  link: TrackingLink;
}

export function LinkDetails({ link }: LinkDetailsProps) {
  const stats = [
    {
      label: "Total Clicks",
      value: link.clicks_count.toLocaleString(),
      icon: MousePointerClick,
      color: "blue" as const,
    },
    {
      label: "Total Installs",
      value: link.installs_count.toLocaleString(),
      icon: Download,
      color: "green" as const,
    },
    {
      label: "Conversion Rate",
      value: `${link.clicks_count > 0 ? ((link.installs_count / link.clicks_count) * 100).toFixed(2) : "0.00"}%`,
      icon: TrendingUp,
      color: "purple" as const,
    },
    {
      label: "Click-Through Rate",
      value: link.clicks_count > 0 ? "100%" : "0%",
      icon: Target,
      color: "orange" as const,
    },
  ];

  const sections: DetailSection[] = [
    {
      title: "Tracking URL",
      fields: [
        { label: "URL", value: link.tracking_url || "", copyable: true },
      ],
    },
    {
      title: "Campaign IDs",
      fields: [
        { label: "Campaign ID", value: link.campaign_id || "N/A" },
        { label: "Adset ID", value: link.adset_id || "N/A" },
        { label: "Ad ID", value: link.ad_id || "N/A" },
      ],
    },
    ...(link.custom_params && Object.keys(link.custom_params).length > 0
      ? [
          {
            title: "Custom Parameters",
            fields: Object.entries(link.custom_params).map(([k, v]) => ({
              label: k,
              value: String(v),
            })),
          },
        ]
      : []),
    {
      title: "Timestamps",
      fields: [
        { label: "Created", value: new Date(link.created_at).toLocaleString() },
        {
          label: "Last Updated",
          value: new Date(link.updated_at).toLocaleString(),
        },
      ],
    },
  ];

  return (
    <>
      <StatsGrid stats={stats} columns={4} />
      <DetailsCard title="Link Details" sections={sections} />
    </>
  );
}
