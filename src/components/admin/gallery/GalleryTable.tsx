import { MoreHorizontal, Pencil, Store, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Storefront } from "@/types/storefront";

interface GalleryTableProps {
  galleries: Storefront[];
  onDeleteClick: (gallery: Storefront) => void;
}

export const GalleryTable = ({ galleries, onDeleteClick }: GalleryTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-4 text-left font-medium">Name</th>
            <th className="p-4 text-left font-medium">Status</th>
            <th className="p-4 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {galleries.map((gallery) => (
            <tr key={gallery.id} className="border-b">
              <td className="p-4">{gallery.name}</td>
              <td className="p-4">{gallery.status}</td>
              <td className="p-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        navigate(`/admin/storefront/${gallery.id}`)
                      }
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Storefront
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        navigate(`/admin/products-new/${gallery.id}`)
                      }
                    >
                      <Store className="mr-2 h-4 w-4 text-accent" />
                      Products (New)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteClick(gallery)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};