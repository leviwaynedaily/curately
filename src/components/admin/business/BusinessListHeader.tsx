import { Button } from "@/components/ui/button";
import { BusinessSearch } from "./BusinessSearch";

type BusinessListHeaderProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
};

export const BusinessListHeader = ({
  searchQuery,
  onSearchChange,
  onAddClick,
}: BusinessListHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Businesses</h2>
        <Button onClick={onAddClick}>Add Business</Button>
      </div>
      <BusinessSearch value={searchQuery} onChange={onSearchChange} />
    </div>
  );
};