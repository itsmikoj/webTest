"use client";

import { X } from "lucide-react";
import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizes = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    { isOpen, onClose, title, children, size = "md", className, ...props },
    ref,
  ) => {
    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div
          ref={ref}
          className={cn(
            "bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-h-[90vh] overflow-y-auto",
            sizes[size],
            className,
          )}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    );
  },
);

Modal.displayName = "Modal";
