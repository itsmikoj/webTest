"use client";

import { useState } from "react";
import { UpdateTrackingLinkData } from "@/types/links";
import { Modal } from "@/components/ui/Modal";
import { FormFields, FormFieldConfig } from "@/components/ui/FormFields";

const formFields: FormFieldConfig[] = [
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

interface EditLinkModalProps {
  link: {
    link_name: string;
    campaign_id?: string | null;
    adset_id?: string | null;
    ad_id?: string | null;
    custom_params?: Record<string, any>;
  };
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateTrackingLinkData) => Promise<void>;
}

export function EditLinkModal({
  link,
  isOpen,
  onClose,
  onSave,
}: EditLinkModalProps) {
  const [formData, setFormData] = useState<UpdateTrackingLinkData>({
    link_name: link.link_name,
    campaign_id: link.campaign_id ?? "",
    adset_id: link.adset_id ?? "",
    ad_id: link.ad_id ?? "",
    custom_params: link.custom_params || {},
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        ...formData,
        campaign_id: formData.campaign_id || undefined,
        adset_id: formData.adset_id || undefined,
        ad_id: formData.ad_id || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Failed to update link:", error);
    } finally {
      setSaving(false);
    }
  };

  const customParams = Object.entries(formData.custom_params || {}).map(
    ([k, v]) => ({ key: k, value: String(v) }),
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Tracking Link"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <FormFields
          fields={formFields}
          values={formData}
          onChange={(name, value) =>
            setFormData((prev) => ({ ...prev, [name]: value }))
          }
          keyValueFields={{
            label: "Custom Parameters",
            valueName: "Value",
            pairs: customParams,
            onAdd: (k, v) =>
              setFormData((prev) => ({
                ...prev,
                custom_params: { ...prev.custom_params, [k]: v },
              })),
            onRemove: (k) =>
              setFormData((prev) => {
                const newParams = { ...prev.custom_params };
                delete newParams[k];
                return { ...prev, custom_params: newParams };
              }),
          }}
        />
        <div className="flex gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !formData.link_name}
            className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
