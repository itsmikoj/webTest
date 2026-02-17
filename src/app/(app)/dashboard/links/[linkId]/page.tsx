"use client";

import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState, EmptyState } from "@/components/states";
import { ActionsBar } from "@/components/ui";
import { LinkDetails } from "@/components/links/LinkDetails";
import { EditLinkModal } from "@/components/links/EditLinkModal";
import { Edit, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import { ROUTES } from "@/config/constants";

export default function TrackingLinkDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { selectedApp } = useApp();
  const { links, isLoading, updateLink, deleteLink } = useDashboardData(
    selectedApp?.id || null,
  );
  const [showEditModal, setShowEditModal] = useState(false);

  const linkId = params.linkId as string;
  const link = useMemo(
    () => links.find((l) => l.id === linkId),
    [links, linkId],
  );

  const handleEdit = () => link && setShowEditModal(true);

  const handleUpdate = async (data: Parameters<typeof updateLink>[1]) => {
    await updateLink(linkId, data);
    setShowEditModal(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this tracking link?")) return;
    await deleteLink(linkId);
    router.push(ROUTES.links);
  };

  if (isLoading) {
    return <LoadingState message="Loading link details..." />;
  }

  if (!link) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Link Not Found"
          description="The requested tracking link could not be found"
          showFilters={false}
        />
        <EmptyState
          title="Tracking link not found"
          description="This link may have been deleted or doesn't exist"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title={link.link_name}
        description="View and manage tracking link details"
        showFilters={false}
      />

      <ActionsBar
        backButton={{
          label: "Back to Links",
          onClick: () => router.push(ROUTES.links),
        }}
        actions={[
          { label: "Edit", onClick: handleEdit, icon: Edit },
          {
            label: "Delete",
            onClick: handleDelete,
            icon: Trash2,
            variant: "danger",
          },
        ]}
      />

      <LinkDetails link={link} />

      {showEditModal && (
        <EditLinkModal
          link={link}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
}
