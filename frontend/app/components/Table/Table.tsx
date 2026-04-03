"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";

interface TableColumnConfig {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface ActionMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: any) => void;
  variant?: "default" | "danger";
}

interface TablePagination {
  currentPage: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
}

interface TableProps {
  columns: TableColumnConfig[];
  data: any[];
  onRowClick?: (row: any) => void;
  selectable?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
  rowIdKey?: string;
  className?: string;
  striped?: boolean;
  actions?: ActionMenuItem[];
  pagination?: TablePagination;
}

type SortOrder = "asc" | "desc" | null;

function ActionMenu({ row, actions }: { row: any; actions: ActionMenuItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative flex justify-end" ref={ref}>
      <button
        title="Actions"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
          <circle cx="9" cy="4" r="1.5" />
          <circle cx="9" cy="9" r="1.5" />
          <circle cx="9" cy="14" r="1.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-30">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick(row);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
                action.variant === "danger"
                  ? "text-red-600 hover:bg-red-50"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PaginationButtons({ pagination }: { pagination: TablePagination }) {
  const totalPages = Math.ceil(pagination.totalItems / pagination.rowsPerPage);
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= pagination.currentPage - 1 && i <= pagination.currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button
        title="Previous page"
        onClick={() => pagination.onPageChange(Math.max(1, pagination.currentPage - 1))}
        disabled={pagination.currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">...</span>
        ) : (
          <button
            key={page}
            onClick={() => pagination.onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
              pagination.currentPage === page
                ? "bg-[#0891b2] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        )
      )}
      <button
        title="Next page"
        onClick={() => pagination.onPageChange(Math.min(totalPages, pagination.currentPage + 1))}
        disabled={pagination.currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
      </button>
    </div>
  );
}

export default function Table({
  columns,
  data,
  onRowClick,
  selectable = false,
  onSelectionChange,
  rowIdKey = "id",
  className = "",
  striped = false,
  actions,
  pagination,
}: TableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const handleSort = useCallback(
    (key: string) => {
      if (sortColumn === key) {
        setSortOrder(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? null : "asc"
        );
        if (sortOrder === "desc") {
          setSortColumn(null);
        }
      } else {
        setSortColumn(key);
        setSortOrder("asc");
      }
    },
    [sortColumn, sortOrder]
  );

  const sortedData = useCallback(() => {
    if (!sortColumn || !sortOrder) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortOrder])();

  const handleSelectRow = useCallback(
    (rowId: string) => {
      const newSelected = selectedRows.includes(rowId)
        ? selectedRows.filter((id) => id !== rowId)
        : [...selectedRows, rowId];
      setSelectedRows(newSelected);
      onSelectionChange?.(newSelected);
    },
    [selectedRows, onSelectionChange]
  );

  const handleSelectAll = useCallback(() => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
      onSelectionChange?.([]);
    } else {
      const allIds = data.map((row) => row[rowIdKey]);
      setSelectedRows(allIds);
      onSelectionChange?.(allIds);
    }
  }, [selectedRows, data, rowIdKey, onSelectionChange]);

  const totalCols = columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0);

  const paginationInfo = pagination
    ? {
        start: (pagination.currentPage - 1) * pagination.rowsPerPage + 1,
        end: Math.min(
          pagination.currentPage * pagination.rowsPerPage,
          pagination.totalItems
        ),
        total: pagination.totalItems,
      }
    : null;

  return (
    <div className={`${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#0891b2]">
              {selectable && (
                <th className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    title="Select all rows"
                    checked={selectedRows.length === data.length && data.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-white/50 text-aamusted-blue focus:ring-white cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-3 text-left font-semibold text-white text-[13px] tracking-wide ${
                    col.sortable ? "cursor-pointer select-none" : ""
                  }`}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.label}</span>
                    {col.sortable && sortColumn === col.key && (
                      <span className="text-white/80 text-xs">
                        {sortOrder === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-3 py-3 w-12" />
              )}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={totalCols}
                  className="px-5 py-8 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            ) : (
              sortedData.map((row, idx) => (
                <tr
                  key={row[rowIdKey]}
                  className={`border-b border-gray-200 transition-colors hover:bg-gray-50/80 ${
                    striped && idx % 2 === 1 ? "bg-gray-50/50" : "bg-white"
                  } ${onRowClick ? "cursor-pointer" : ""}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        title="Select row"
                        checked={selectedRows.includes(row[rowIdKey])}
                        onChange={() => handleSelectRow(row[rowIdKey])}
                        className="rounded border-gray-300 text-aamusted-blue focus:ring-aamusted-gold cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-3 text-gray-700 text-[13px]">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-3 py-3 w-12">
                      <ActionMenu row={row} actions={actions} />
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && paginationInfo && (
        <div className="flex items-center justify-between px-5 py-3 text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span>
              Showing {paginationInfo.start} to {paginationInfo.end} of{" "}
              {paginationInfo.total} entries
            </span>
            <div className="flex items-center gap-1.5">
              <span>Show</span>
              <select
                title="Rows per page"
                className="border border-gray-300 rounded px-1.5 py-0.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#0891b2]"
                value={pagination.rowsPerPage}
                onChange={(e) =>
                  pagination.onRowsPerPageChange?.(Number(e.target.value))
                }
              >
                {(pagination.rowsPerPageOptions || [10, 20, 30, 50]).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <PaginationButtons pagination={pagination} />
        </div>
      )}
    </div>
  );
}

export type { TableColumnConfig, ActionMenuItem, TablePagination };
