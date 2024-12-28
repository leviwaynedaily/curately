import { Product } from "@/components/admin/gallery/products/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

type ProductCardActionsProps = {
  product: Product;
  onEdit: () => void;
  onDelete: (productId: string) => void;
};

export const ProductCardActions = ({
  product,
  onEdit,
  onDelete,
}: ProductCardActionsProps) => {
  return (
    <div className="absolute top-2 right-2 z-10">
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="bg-white/80 hover:bg-white/90 backdrop-blur-sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(product.id);
            }}
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};