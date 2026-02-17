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

  return (
    <div>
      <label
        htmlFor={field.name}
        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
      >
        {field.label}{" "}
        {field.required && <span className="text-red-500">*</span>}
        {field.description && (
          <span className="text-slate-500 dark:text-slate-400 font-normal ml-2">
            {field.description}
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
          className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      ) : field.options ? (
        <select
          id={field.name}
          name={field.name}
          value={value ?? ""}
          onChange={handleChange}
          className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
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
          className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
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
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        {label}
      </label>
      {pairs.length > 0 && (
        <div className="mb-3 space-y-2">
          {pairs.map((pair) => (
            <div
              key={pair.key}
              className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3"
            >
              <span className="text-sm font-mono text-slate-700 dark:text-slate-300 flex-1">
                {pair.key}: {pair.value}
              </span>
              <button
                type="button"
                onClick={() => onRemove(pair.key)}
                className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Key"
          className="flex-1 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
        <input
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder={valueName}
          className="flex-1 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!key || !val}
          className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
