import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type SortOption = "name_asc" | "name_desc" | "date_asc" | "date_desc";
type StatusFilter = "all" | "active" | "archived";

type GalleryControlsProps = {
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
};

export const GalleryControls = ({
  sort,
  onSortChange,
  status,
  onStatusChange,
}: GalleryControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="space-y-2 flex-1">
        <Label htmlFor="sort">Sort by</Label>
        <Select value={sort} onValueChange={onSortChange}>
          <SelectTrigger id="sort">
            <SelectValue placeholder="Sort galleries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name_asc">Name (A-Z)</SelectItem>
            <SelectItem value="name_desc">Name (Z-A)</SelectItem>
            <SelectItem value="date_desc">Newest first</SelectItem>
            <SelectItem value="date_asc">Oldest first</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 flex-1">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};