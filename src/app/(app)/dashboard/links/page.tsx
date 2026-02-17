"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState, LoadingState } from "@/components/states";
import { SearchBar, Modal, ViewModeToggle } from "@/components/ui";
import { CreateLinkForm } from "@/components/forms/LinkForm";
import { LinkCard } from "../../../../components/links/LinkCard";
import { LinkTable } from "../../../../components/links/LinkTable";
import { Plus } from "lucide-react";
import { STORAGE_KEYS } from "@/config/constants";

export default function TrackingLinksPage() {
  const router = useRouter();
  const { selectedApp } = useApp();
  const { links, isLoading, refetch, deleteLink } = useDashboardData(
    selectedApp?.id || null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useLocalStorage<"grid" | "list">(
    STORAGE_KEYS.mode,
    "grid",
  );

  const filteredLinks = links.filter(
    (link) =>
      link.link_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.campaign_id?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = async (linkId: string) => {
    if (!confirm("Are you sure you want to delete this tracking link?")) return;
    await deleteLink(linkId);
  };

  if (!selectedApp) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Tracking Links"
          description="Manage tracking links for your campaigns"
          showFilters={false}
        />
        <EmptyState
          title="No app selected"
          description="Select an app to view and manage its tracking links"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tracking Links"
        description="Create and manage tracking links for your campaigns"
        showFilters={false}
        onRefresh={refetch}
        isRefreshing={isLoading}
      />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <div className="flex items-center gap-2">
          <ViewModeToggle value={viewMode} onChange={setViewMode} />
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
          >
            <Plus className="w-4 h-4" /> Create Link
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : filteredLinks.length === 0 ? (
        <EmptyState
          title={searchTerm ? "No results found" : "No tracking links"}
          description={
            searchTerm
              ? "Try adjusting your search"
              : "Create your first tracking link"
          }
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLinks.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onDelete={handleDelete}
              onClick={() => router.push(`/dashboard/links/${link.id}`)}
            />
          ))}
        </div>
      ) : (
        <LinkTable links={filteredLinks} onDelete={handleDelete} />
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Tracking Link"
        size="lg"
      >
        <CreateLinkForm
          onSuccess={() => setShowCreateModal(false)}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </div>
  );
}
