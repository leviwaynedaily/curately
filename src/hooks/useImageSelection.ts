import { useState } from "react";

export const useImageSelection = () => {
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const toggleImageSelection = (imageId: string) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(imageId)) {
      newSelection.delete(imageId);
    } else {
      newSelection.add(imageId);
    }
    setSelectedImages(newSelection);
  };

  const clearSelection = () => {
    setSelectedImages(new Set());
    setIsSelectionMode(false);
  };

  return {
    selectedImages,
    isSelectionMode,
    setIsSelectionMode,
    toggleImageSelection,
    clearSelection,
  };
};