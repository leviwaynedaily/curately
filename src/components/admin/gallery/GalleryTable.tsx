import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Package, Pencil, Store, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GalleryDeleteDialog } from "./GalleryDeleteDialog";
import { useState } from "react";
import { Storefront } from "@/types/storefront";

type GalleryTableProps = {
  galleries: Storefront[];
  onDelete: (id: string) => void;
};

export const GalleryTable = ({ galleries, onDelete }: GalleryTableProps) => {
  const navigate = useNavigate();
  const [galleryToDelete, setGalleryToDelete] = useState<Storefront | null>(null);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Business</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {galleries.map((gallery) => (
            <TableRow key={gallery.id}>
              <TableCell>{gallery.name}</TableCell>
              <TableCell>
                {gallery.businesses?.name}
              </TableCell>
              <TableCell>{gallery.status}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/storefront/${gallery.id}`)}
                  >
                    <Store className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/admin/products/${gallery.id}`)}
                  >
                    <Package className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/admin/products-new/${gallery.id}`)}
                  >
                    <Package className="h-4 w-4 text-accent" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/admin/storefront/${gallery.id}`)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setGalleryToDelete(gallery)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <GalleryDeleteDialog
        gallery={galleryToDelete}
        onClose={() => setGalleryToDelete(null)}
        onConfirm={(id) => {
          onDelete(id);
          setGalleryToDelete(null);
        }}
      />
    </div>
  );
};