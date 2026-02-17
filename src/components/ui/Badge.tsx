import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import { StatusType } from "@/types";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: StatusType | "default";
  size?: "xs" | "sm" | "md";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { className, variant = "default", size = "md", children, ...props },
    ref,
  ) => {
    const variants = {
      active: "bg-green-100 text-green-700 border-green-200",
      inactive: "bg-slate-100 text-slate-700 border-slate-200",
      dev: "bg-amber-100 text-amber-700 border-amber-200",
      beta: "bg-indigo-100 text-indigo-700 border-indigo-200",
      default: "bg-slate-100 text-slate-700 border-slate-200",
    };

    const sizes = {
      xs: "px-0.5 py-0.5 text-xs",
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-1 text-sm",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center font-medium border rounded-full",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            `w-1.5 h-1.5 rounded-full ${size === "xs" ? "" : "mr-1.5"}`,
            variant === "active" && "bg-green-500",
            variant === "inactive" && "bg-slate-400",
            variant === "dev" && "bg-amber-500",
            variant === "beta" && "bg-indigo-500",
            variant === "default" && "bg-slate-400",
          )}
        />
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";
