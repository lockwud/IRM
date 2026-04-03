"use client";
import { useState, useMemo, useCallback } from "react";
import { filterStudents, searchStudents } from "../utils/filterHelpers";
import { Student, FilterOptions } from "../types";

interface UseTableFiltersOptions {
  itemsPerPage?: number;
}

export function useTableFilters(
  data: Student[],
  options: UseTableFiltersOptions = {}
) {
  const { itemsPerPage = 10 } = options;

  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Apply filters and search
  const filteredData = useMemo(() => {
    let result = filterStudents(data, filters);
    if (searchQuery) {
      result = searchStudents(result, searchQuery);
    }
    return result;
  }, [data, filters, searchQuery]);

  // Paginate
  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(1);
  }, []);

  return {
    filteredData,
    paginatedData,
    currentPage,
    totalPages,
    totalItems: filteredData.length,
    searchQuery,
    setSearchQuery,
    filters,
    updateFilters,
    clearFilters,
    setCurrentPage,
  };
}
