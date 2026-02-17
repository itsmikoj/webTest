"use client";

import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

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
          "bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700",
          className,
        )}
        {...props}
      >
        {title && (
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {title}
            </h2>
          </div>
        )}

        <div className="p-6 space-y-6">
          {sections?.map((section, sIndex) => (
            <div key={sIndex}>
              {section.title && (
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
                  {section.title}
                </h3>
              )}
              <div
                className={cn(
                  section.fields.length > 1 &&
                    "grid grid-cols-1 md:grid-cols-2 gap-4",
                  section.fields.length === 3 && "md:grid-cols-3",
                )}
              >
                {section.fields.map((field, fIndex) => (
                  <DetailField key={fIndex} {...field} />
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

function DetailField({ label, value, copyable }: DetailField) {
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
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        {label}
      </label>
      {copyable ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={String(value)}
            readOnly
            className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg font-mono text-sm"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      ) : (
        <input
          type="text"
          value={String(value)}
          readOnly
          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
        />
      )}
    </div>
  );
}

import * as React from "react";
