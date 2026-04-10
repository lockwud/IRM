"use client";
import React, { useState } from "react";
import Table from "../components/Table/Table";
import type { ActionMenuItem } from "../components/Table/Table";

interface InternshipRecord {
  id: number;
  mentee: {
    name: string;
    school: string;
    email?: string;
  };
  mentor: {
    name: string;
  };
  status: string;
  startDate?: string;
  endDate?: string;
  priority?: "high" | "medium" | "low";
}

interface InternshipsTableProps {
  records: InternshipRecord[];
  onRecordClick?: (record: InternshipRecord) => void;
}

const statusLabels: Record<string, string> = {
  registration: "Registration",
  in_progress: "In Progress",
  completed: "Completed",
};

const statusConfig: Record<string, { label: string; cls: string }> = {
  registration: { label: "Registration", cls: "badge-registration" },
  in_progress:  { label: "In Progress",  cls: "badge-in_progress"  },
  completed:    { label: "Completed",    cls: "badge-completed"    },
};

function StatusBadge({ value }: { value: string }) {
  const s = statusConfig[value] || { label: value, cls: "badge-registration" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${s.cls}`}>
      {s.label}
    </span>
  );
}

export default function InternshipsTable({ records, onRecordClick }: InternshipsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const paginatedRecords = records.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const columns = [
    {
      key: "mentee",
      label: "Intern Name",
      sortable: true,
      render: (value: { name: string; email?: string; school: string }) => value.name,
    },
    {
      key: "mentee",
      label: "Intern Email",
      sortable: true,
      render: (value: { name: string; email?: string; school: string }) => value.email || "—",
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => <StatusBadge value={value} />,
    },
    {
      key: "mentee",
      label: "School",
      sortable: true,
      render: (value: { name: string; email?: string; school: string }) => value.school,
    },
  ];

  const tableActions: ActionMenuItem[] = [
    {
      label: "Edit",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      ),
      onClick: (row) => console.log("Edit internship:", row),
    },
    {
      label: "Delete",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      ),
      onClick: (row) => console.log("Delete internship:", row),
      variant: "danger",
    },
  ];

  return (
    <Table
      columns={columns}
      data={paginatedRecords}
      onRowClick={onRecordClick}
      rowIdKey="id"
      actions={tableActions}
      pagination={{
        currentPage,
        totalItems: records.length,
        rowsPerPage,
        onPageChange: setCurrentPage,
        onRowsPerPageChange: (rpp) => {
          setRowsPerPage(rpp);
          setCurrentPage(1);
        },
        rowsPerPageOptions: [10, 20, 30, 50],
      }}
    />
  );
}
