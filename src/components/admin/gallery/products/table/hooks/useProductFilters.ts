import { useState } from "react";
import { Product } from "../../types";

export const useProductFilters = (products: Product[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesTag = !selectedTag || (product.tags && product.tags.some(tag => tag.name === selectedTag));

    return matchesSearch && matchesCategory && matchesTag;
  });

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedTag,
    setSelectedTag,
    filteredProducts
  };
};