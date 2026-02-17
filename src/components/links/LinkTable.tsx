"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrackingLink } from "@/types";
import { DataTable } from "@/components/shared/DataTable";
import { Copy, Check, Trash2 } from "lucide-react";

interface LinkTableProps {
  links: TrackingLink[];
  onDelete: (linkId: string) => void;
}

export function LinkTable({ links, onDelete }: LinkTableProps) {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getConversionRate = (link: TrackingLink) => {
    return link.clicks_count > 0
      ? ((link.installs_count / link.clicks_count) * 100).toFixed(2)
      : "0.00";
  };

  return (
    <DataTable
      data={links}
      keyExtractor={(link) => link.id}
      onRowClick={(link) => router.push(`/dashboard/links/${link.id}`)}
      columns={[
        {
          key: "link_name",
          header: "Name",
          render: (link) => (
            <div className="font-medium text-slate-900 dark:text-white">
              {link.link_name}
            </div>
          ),
        },
        { key: "campaign_id", header: "Campaign" },
        {
          key: "tracking_url",
          header: "Tracking URL",
          render: (link) => (
            <div className="flex items-center gap-2 max-w-xs">
              <span className="truncate text-xs font-mono text-slate-600 dark:text-slate-400">
                {link.tracking_url}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(link.tracking_url || "", link.id);
                }}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
              >
                {copiedId === link.id ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-400" />
                )}
              </button>
            </div>
          ),
        },
        {
          key: "clicks_count",
          header: "Clicks",
          render: (link) => (
            <span className="text-blue-600 font-semibold">
              {link.clicks_count?.toLocaleString() || "0"}
            </span>
          ),
        },
        {
          key: "installs_count",
          header: "Installs",
          render: (link) => (
            <span className="text-green-600 font-semibold">
              {link.installs_count?.toLocaleString() || "0"}
            </span>
          ),
        },
        {
          key: "cvr",
          header: "CVR",
          render: (link) => (
            <span className="text-purple-600 font-semibold">
              {getConversionRate(link)}%
            </span>
          ),
        },
        {
          key: "created_at",
          header: "Created",
          render: (link) => new Date(link.created_at).toLocaleDateString(),
        },
        {
          key: "actions",
          header: "",
          render: (link) => (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(link.id);
              }}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          ),
          className: "w-12",
        },
      ]}
      maxHeight={500}
      scrollable={true}
    />
  );
}
