"use client";

import React, { forwardRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface FormFieldConfig {
  name: string;
  label: string;
  type?: "text" | "number" | "email" | "password" | "textarea";
  placeholder?: string;
  required?: boolean;
  description?: string;
  options?: { label: string; value: string }[];
}

export interface KeyValuePair {
  key: string;
  value: string;
}

interface FormFieldsProps {
  fields: FormFieldConfig[];
  values: Record<string, any>;
  onChange: (name: string, value: any) => void;
  keyValueFields?: {
    label: string;
    valueName: string;
    pairs: KeyValuePair[];
    onAdd: (key: string, value: string) => void;
    onRemove: (key: string) => void;
  };
}

export const FormFields = forwardRef<HTMLDivElement, FormFieldsProps>(
  ({ fields, values, onChange, keyValueFields }, ref) => {
    return (
      <div ref={ref} className="space-y-4">
        {fields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={values[field.name]}
            onChange={onChange}
          />
        ))}

        {keyValueFields && (
          <KeyValueField
            label={keyValueFields.label}
            valueName={keyValueFields.valueName}
            pairs={keyValueFields.pairs}
            onAdd={keyValueFields.onAdd}
            onRemove={keyValueFields.onRemove}
          />
        )}
      </div>
    );
  },
);

FormFields.displayName = "FormFields";

function FormField({
  field,
  value,
  onChange,
}: {
  field: FormFieldConfig;
  value: any;
  onChange: (name: string, value: any) => void;
}) {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    onChange(field.name, e.target.value);
  };

  const inputClass =
    "w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm transition-colors";

  return (
    <div>
      <label
        htmlFor={field.name}
        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
      >
        {field.label}{" "}
        {field.required && <span className="text-red-500">*</span>}
        {field.description && (
          <span className="text-slate-400 dark:text-slate-500 font-normal ml-1">
            ({field.description})
          </span>
        )}
      </label>
      {field.type === "textarea" ? (
        <textarea
          id={field.name}
          name={field.name}
          value={value ?? ""}
          onChange={handleChange}
          placeholder={field.placeholder}
          required={field.required}
          rows={3}
          className={inputClass}
        />
      ) : field.options ? (
        <select
          id={field.name}
          name={field.name}
          value={value ?? ""}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">Select...</option>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={field.type || "text"}
          id={field.name}
          name={field.name}
          value={value ?? ""}
          onChange={handleChange}
          placeholder={field.placeholder}
          required={field.required}
          className={inputClass}
        />
      )}
    </div>
  );
}

function KeyValueField({
  label,
  valueName,
  pairs,
  onAdd,
  onRemove,
}: {
  label: string;
  valueName: string;
  pairs: KeyValuePair[];
  onAdd: (key: string, value: string) => void;
  onRemove: (key: string) => void;
}) {
  const [key, setKey] = useState("");
  const [val, setVal] = useState("");

  const handleAdd = () => {
    if (key && val) {
      onAdd(key, val);
      setKey("");
      setVal("");
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
      </label>

      {pairs.length > 0 && (
        <div className="mb-3 space-y-2">
          {pairs.map((pair) => (
            <div
              key={pair.key}
              className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl px-3 py-2.5"
            >
              <span className="text-sm font-mono text-slate-700 dark:text-slate-300 flex-1 truncate">
                <span className="text-slate-500">{pair.key}:</span> {pair.value}
              </span>
              <button
                type="button"
                onClick={() => onRemove(pair.key)}
                className="flex-shrink-0 p-1 text-red-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Always a single row */}
      <div className="flex gap-2">
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Key"
          className="flex-1 min-w-0 px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
        />
        <input
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder={valueName}
          className="flex-1 min-w-0 px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!key || !val}
          title="Add parameter"
          className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-slate-700 dark:bg-slate-600 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-slate-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
