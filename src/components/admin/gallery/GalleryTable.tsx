import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Copy, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

type GalleryTableProps = {
  galleries: any[];
  onEdit: (gallery: any) => void;
  onDelete: (gallery: any) => void;
};

export const GalleryTable = ({
  galleries,
  onEdit,
  onDelete,
}: GalleryTableProps) => {
  const { toast } = useToast();

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({
      description: "Gallery ID copied to clipboard",
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>ID</TableHead>
          <TableHead>Business</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {galleries?.map((gallery) => (
          <TableRow key={gallery.id}>
            <TableCell>
              <Link 
                to={`/storefront/${gallery.id}`}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {gallery.name}
              </Link>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">{gallery.id}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopyId(gallery.id)}
                  className="h-6 w-6"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </TableCell>
            <TableCell>{gallery.businesses?.name || 'No business assigned'}</TableCell>
            <TableCell>{gallery.status}</TableCell>
            <TableCell>
              {new Date(gallery.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <a
                  href={`/storefront/${gallery.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(gallery)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(gallery)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};