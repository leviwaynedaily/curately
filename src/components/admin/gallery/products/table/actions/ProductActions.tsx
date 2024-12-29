import { Button } from "@/components/ui/button";
import { Edit, Save, X, Trash, Image as ImageIcon, Copy, Loader2, Archive } from "lucide-react";
import { useState } from "react";
import { Product } from "../../types";
import { ProductDeleteDialog } from "./ProductDeleteDialog";

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

  const handleDelete = async () => {
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
          <Save className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </>
    );
  }

  return (
    <>
      <Button variant="ghost" size="icon" onClick={onEdit}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash className="h-4 w-4" />
        )}
      </Button>
      <Button variant="ghost" size="icon" onClick={onMediaClick}>
        <ImageIcon className="h-4 w-4" />
      </Button>
      {onDuplicate && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleDuplicate}
          disabled={isDuplicating}
        >
          {isDuplicating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      )}
      {onArchive && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleArchive}
          disabled={isArchiving || product.status === 'archived'}
          title={product.status === 'archived' ? 'Product is already archived' : 'Archive product'}
        >
          {isArchiving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Archive className="h-4 w-4" />
          )}
        </Button>
      )}

      <ProductDeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};