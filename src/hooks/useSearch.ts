import { useState, useCallback } from "react";
import { useDebounce } from "./use-debounce";

export const useSearch = (initialValue: string = "") => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const handleSearchChange = useCallback((value: string) => {
    console.log("Search query changed:", value);
    setSearchQuery(value);
  }, []);

  return {
    searchQuery,
    debouncedSearch,
    handleSearchChange,
  };
};