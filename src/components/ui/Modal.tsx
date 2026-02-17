"use client";

import { X } from "lucide-react";
import { HTMLAttributes, forwardRef, useEffect } from "react";
import { cn } from "@/lib/utils/cn";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizes = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
};

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      children,
      footer,
      size = "md",
      className,
      ...props
    },
    ref,
  ) => {
    // Prevent body scroll when open
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
      return () => {
        document.body.style.overflow = "";
      };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4"
        onClick={onClose}
      >
        <div
          className={cn(
            "bg-white dark:bg-slate-800 w-full max-h-[92dvh] flex flex-col",
            "rounded-t-2xl sm:rounded-xl",
            "sm:w-full shadow-2xl pb-safe",
            sizes[size],
            className,
          )}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {/* Drag handle — mobile only */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
            <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
          </div>

          {/* Header */}
          <div className="flex-shrink-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-5 py-4 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content — flex col so children can self-manage scroll+footer */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {children}
          </div>

          {footer && (
            <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-700  bg-white dark:bg-slate-800 pb-safe">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  },
);

Modal.displayName = "Modal";
