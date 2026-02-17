"use client";

import * as React from "react";
import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import { Copy, Check } from "lucide-react";

export interface DetailField {
  label: string;
  value: React.ReactNode;
  copyable?: boolean;
}

export interface DetailSection {
  title?: string;
  fields: DetailField[];
}

interface DetailsCardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  sections?: DetailSection[];
  children?: React.ReactNode;
}

export const DetailsCard = forwardRef<HTMLDivElement, DetailsCardProps>(
  ({ title, sections, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700",
          className,
        )}
        {...props}
      >
        {title && (
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              {title}
            </h2>
          </div>
        )}

        <div className="p-5 space-y-6">
          {sections?.map((section, sIndex) => (
            <div key={sIndex}>
              {section.title && (
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  {section.title}
                </p>
              )}
              <div
                className={cn(
                  "grid grid-cols-1 gap-3",
                  section.fields.length > 1 && "sm:grid-cols-2",
                  section.fields.length === 3 && "sm:grid-cols-3",
                )}
              >
                {section.fields.map((field, fIndex) => (
                  <DetailFieldItem key={fIndex} {...field} />
                ))}
              </div>
            </div>
          ))}
          {children}
        </div>
      </div>
    );
  },
);

DetailsCard.displayName = "DetailsCard";

function DetailFieldItem({ label, value, copyable }: DetailField) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (typeof value === "string") {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
        {label}
      </p>
      {copyable ? (
        <div className="flex gap-2 items-stretch">
          <div className="flex-1 min-w-0 px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
            <p className="font-mono text-xs text-slate-700 dark:text-slate-300 truncate">
              {String(value)}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      ) : (
        <div className="px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
          <p className="text-sm text-slate-800 dark:text-slate-200 truncate">
            {String(value)}
          </p>
        </div>
      )}
    </div>
  );
}
