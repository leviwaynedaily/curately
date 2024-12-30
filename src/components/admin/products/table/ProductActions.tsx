import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Archive, Trash } from "lucide-react";
import { Product } from "../../gallery/products/types";

type ProductActionsProps = {
  product: Product;
  onUpdate: (product: Product) => void;
};

export const ProductActions = ({ product, onUpdate }: ProductActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            // TODO: Implement edit modal
            console.log("Edit product:", product.id);
          }}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onUpdate({
              ...product,
              status: product.status === "active" ? "archived" : "active",
            });
          }}
        >
          <Archive className="mr-2 h-4 w-4" />
          {product.status === "active" ? "Archive" : "Unarchive"}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => {
            // TODO: Implement delete confirmation
            console.log("Delete product:", product.id);
          }}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};