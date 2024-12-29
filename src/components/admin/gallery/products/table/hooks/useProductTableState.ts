import { useState } from "react";
import { Product } from "../../types";

export const useProductTableState = (products: Product[]) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortField, setSortField] = useState<keyof Product | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showHiddenFields, setShowHiddenFields] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(new Set(products.map(p => p.id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleToggleProduct = (productId: string) => {
    const newSelection = new Set(selectedProducts);
    if (newSelection.has(productId)) {
      newSelection.delete(productId);
    } else {
      newSelection.add(productId);
    }
    setSelectedProducts(newSelection);
  };

  return {
    editingId,
    setEditingId,
    editedProduct,
    setEditedProduct,
    selectedProduct,
    setSelectedProduct,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    searchTerm,
    setSearchTerm,
    showHiddenFields,
    setShowHiddenFields,
    selectedProducts,
    selectedCategory,
    setSelectedCategory,
    page,
    setPage,
    pageSize,
    setPageSize,
    handleSelectAll,
    handleToggleProduct,
  };
};