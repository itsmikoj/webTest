import { useState } from "react";
import { LucideIcon } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  label: string;
  icon?: LucideIcon;
  error?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  minLength?: number;
  placeholder?: string;
}

export function PasswordInput({
  label,
  icon: Icon,
  error,
  ...props
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-slate-400" />
          </div>
        )}
        <input
          type={show ? "text" : "password"}
          className={`w-full ${Icon ? "pl-10" : "px-4"} pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white ${error ? "border-red-500" : "border-slate-300"}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          {show ? (
            <EyeOff className="h-4 w-4 text-slate-400" />
          ) : (
            <Eye className="h-4 w-4 text-slate-400" />
          )}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
