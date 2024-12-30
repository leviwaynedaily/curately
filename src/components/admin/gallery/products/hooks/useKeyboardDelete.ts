import { useEffect } from "react";

export const useKeyboardDelete = (
  selectedProducts: Set<string>,
  onDelete: (productIds: string[]) => Promise<void>
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedProducts.size > 0) {
        console.log('Delete key pressed with selected products:', Array.from(selectedProducts));
        if (window.confirm(`Are you sure you want to delete ${selectedProducts.size} selected products?`)) {
          onDelete(Array.from(selectedProducts));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProducts, onDelete]);
};