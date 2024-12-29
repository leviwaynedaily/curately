import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Image as ImageIcon, 
  Copy, 
  Loader2, 
  Archive 
} from "lucide-react";
import { useState } from "react";
import { Product } from "../../types";
import { ProductDeleteDialog } from "./ProductDeleteDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ProductActionsProps = {
  product: Product;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onMediaClick: () => void;
  onDuplicate?: () => void;
  onArchive?: () => void;
};

export const ProductActions = ({
  product,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onMediaClick,
  onDuplicate,
  onArchive,
}: ProductActionsProps) => {
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleDuplicate = async () => {
    if (!onDuplicate) return;
    setIsDuplicating(true);
    try {
      await onDuplicate();
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleArchive = async () => {
    if (!onArchive) return;
    setIsArchiving(true);
    try {
      await onArchive();
    } finally {
      setIsArchiving(false);
    }
  };

  if (isEditing) {
    return (
      <>
        <Button variant="ghost" size="icon" onClick={onSave}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <Loader2 className="h-4 w-4" />
        </Button>
      </>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={onMediaClick}>
        <ImageIcon className="h-4 w-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>

          {onDuplicate && (
            <DropdownMenuItem 
              onClick={handleDuplicate}
              disabled={isDuplicating}
            >
              {isDuplicating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              Duplicate
            </DropdownMenuItem>
          )}

          {onArchive && (
            <DropdownMenuItem
              onClick={handleArchive}
              disabled={isArchiving || product.status === 'archived'}
            >
              {isArchiving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Archive className="h-4 w-4 mr-2" />
              )}
              {product.status === 'archived' ? 'Archived' : 'Archive'}
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            className="text-destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash className="h-4 w-4 mr-2" />
            )}
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProductDeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};