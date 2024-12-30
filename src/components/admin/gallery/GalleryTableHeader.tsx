import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

type GalleryTableHeaderProps = {
  showHiddenFields?: boolean;
};

export const GalleryTableHeader = ({ showHiddenFields }: GalleryTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Status</TableHead>
        {showHiddenFields && (
          <>
            <TableHead>Business</TableHead>
            <TableHead>ID</TableHead>
          </>
        )}
        <TableHead>Created</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};