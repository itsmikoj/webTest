"use client";

import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { FormFields, FormFieldConfig } from "@/components/ui/FormFields";
import { CreateTrackingLinkData } from "@/types";

interface LinkFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const fields: FormFieldConfig[] = [
  {
    name: "link_name",
    label: "Link Name",
    required: true,
    placeholder: "e.g., Black Friday Campaign 2024",
  },
  {
    name: "campaign_id",
    label: "Campaign ID",
    description: "Optional",
    placeholder: "e.g., meta_campaign_123",
  },
  {
    name: "adset_id",
    label: "Adset ID",
    description: "Optional",
    placeholder: "e.g., adset_456",
  },
  {
    name: "ad_id",
    label: "Ad ID",
    description: "Optional",
    placeholder: "e.g., ad_789",
  },
];

export function CreateLinkForm({ onSuccess, onCancel }: LinkFormProps) {
  const { selectedApp } = useApp();
  const { createLink } = useDashboardData(selectedApp?.id || null);
  const [formData, setFormData] = useState<CreateTrackingLinkData>({
    link_name: "",
    campaign_id: "",
    adset_id: "",
    ad_id: "",
    custom_params: {},
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const customParams = Object.entries(formData.custom_params || {}).map(
    ([k, v]) => ({ key: k, value: String(v) }),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.link_name.trim()) {
      setError("Link name is required");
      return;
    }
    try {
      setLoading(true);
      await createLink(formData);
      onSuccess?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      id="create-link-form"
      onSubmit={handleSubmit}
      className="flex flex-col min-h-0 flex-1"
    >
      {/* Scrollable fields area */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
        <FormFields
          fields={fields}
          values={formData}
          onChange={(name, value) =>
            setFormData((p) => ({ ...p, [name]: value }))
          }
          keyValueFields={{
            label: "Custom Parameters",
            valueName: "Value",
            pairs: customParams,
            onAdd: (k, v) =>
              setFormData((p) => ({
                ...p,
                custom_params: { ...p.custom_params, [k]: v },
              })),
            onRemove: (k) =>
              setFormData((p) => {
                const n = p.custom_params || {};
                const { [k]: _, ...rest } = n;
                return { ...p, custom_params: rest };
              }),
          }}
        />
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Fixed action buttons — always visible */}
      <div className="flex-shrink-0 flex gap-3 px-5 sm:px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        {onCancel && (
<button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 font-medium"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !formData.link_name}
          className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Link"}
        </button>
      </div>
    </form>
  );
}

export function LinkForm({ onSuccess, onCancel }: LinkFormProps) {
  return <CreateLinkForm {...{ onSuccess, onCancel }} />;
}
