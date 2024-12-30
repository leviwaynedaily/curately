import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ExternalLink } from "lucide-react";

type GalleryTableProps = {
  galleries: any[];
  onEdit: (gallery: any) => void;
  onDelete: (gallery: any) => void;
};

export const GalleryTable = ({ galleries, onEdit, onDelete }: GalleryTableProps) => {
  const navigate = useNavigate();

  console.log("GalleryTable render, galleries:", galleries);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Business</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {galleries.map((gallery) => (
          <TableRow key={gallery.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                {gallery.header_display === "logo" && gallery.site_logo && (
                  <img 
                    src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/gallery_images/${gallery.site_logo}`} 
                    alt={`${gallery.name} logo`} 
                    className="h-8 w-auto object-contain"
                  />
                )}
                <span>{gallery.name}</span>
              </div>
            </TableCell>
            <TableCell>{gallery.businesses?.name}</TableCell>
            <TableCell>{gallery.status}</TableCell>
            <TableCell>
              {new Date(gallery.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/admin/storefront/${gallery.id}`)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/admin/products/${gallery.id}`)}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(gallery)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};