"use client";

import { useState } from "react";
import { TrackingLink } from "@/types";
import { Copy, Check } from "lucide-react";

interface LinkCardProps {
  link: TrackingLink;
  onDelete: (linkId: string) => void;
  onClick: () => void;
}

export function LinkCard({ link, onDelete, onClick }: LinkCardProps) {
  const [copied, setCopied] = useState(false);

  const conversionRate =
    link.clicks_count > 0
      ? ((link.installs_count / link.clicks_count) * 100).toFixed(2)
      : "0.00";

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (link.tracking_url) {
      navigator.clipboard.writeText(link.tracking_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(link.id);
  };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer overflow-hidden group"
    >
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2 flex-1">
            {link.link_name}
          </h3>
          <button
            onClick={handleDelete}
            className="text-slate-400 hover:text-red-600 p-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
        {link.campaign_id && (
          <p className="text-xs text-slate-500">Campaign: {link.campaign_id}</p>
        )}
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 mb-1">Tracking URL</p>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-mono truncate">
              {link.tracking_url}
            </p>
          </div>
          <button
            onClick={copyToClipboard}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      <div className="p-4 grid grid-cols-3 gap-3">
        <div>
          <p className="text-xs text-slate-500">Clicks</p>
          <p className="text-lg font-bold text-blue-600">{link.clicks_count}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Installs</p>
          <p className="text-lg font-bold text-green-600">
            {link.installs_count}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">CVR</p>
          <p className="text-lg font-bold text-purple-600">{conversionRate}%</p>
        </div>
      </div>

      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {new Date(link.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
        <div className="flex items-center gap-1 text-xs text-blue-600">
          <span>View details</span>
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
