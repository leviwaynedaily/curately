import { useState } from "react";
import { BusinessForm } from "./BusinessForm";
import { BusinessTable } from "./business/BusinessTable";
import { BusinessDeleteDialog } from "./business/BusinessDeleteDialog";
import { BusinessListHeader } from "./business/BusinessListHeader";
import { useBusinesses } from "@/hooks/useBusinesses";
import { useDeleteBusiness } from "@/hooks/useDeleteBusiness";
import { useSearch } from "@/hooks/useSearch";

export const BusinessList = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [businessToDelete, setBusinessToDelete] = useState<any>(null);
  
  const { searchQuery, handleSearchChange } = useSearch("");
  const { data: businesses, isLoading } = useBusinesses(searchQuery);
  const { deleteBusiness } = useDeleteBusiness();

  const handleEdit = (business: any) => {
    setSelectedBusiness(business);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!businessToDelete) return;
    const success = await deleteBusiness(businessToDelete.id);
    if (success) {
      setBusinessToDelete(null);
    }
  };

  if (isLoading) {
    return <div>Loading businesses...</div>;
  }

  return (
    <div className="space-y-4">
      <BusinessListHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onAddClick={() => setIsFormOpen(true)}
      />

      <BusinessTable
        businesses={businesses || []}
        onEdit={handleEdit}
        onDelete={setBusinessToDelete}
      />

      <BusinessForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedBusiness(null);
        }}
        business={selectedBusiness}
      />

      <BusinessDeleteDialog
        isOpen={!!businessToDelete}
        onClose={() => setBusinessToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};