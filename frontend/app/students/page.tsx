"use client";
import { useState } from "react";
import Table from "../components/Table/Table";
import type { ActionMenuItem } from "../components/Table/Table";
import Modal from "../components/Modal/Modal";
import { useModal } from "../lib/hooks/useModal";
import { Student } from "../lib/types";

// Mock data - replace with API call
const mockStudents: Student[] = [
  {
    id: "1",
    fullName: "Kwame Asante",
    indexNumber: "001",
    email: "kwame@example.com",
    phone: "+233 24 123 4567",
    school: "USTED",
    townCity: "Accra",
    municipality: "Accra Metropolitan",
    mentorCount: 2,
    internshipStartDate: "2024-01-15",
    internshipEndDate: "2024-06-15",
    status: "active",
  },
  {
    id: "2",
    fullName: "Ama Boateng",
    indexNumber: "002",
    email: "ama@example.com",
    phone: "+233 24 987 6543",
    school: "STEP",
    townCity: "Kumasi",
    municipality: "Kumasi Metropolitan",
    mentorCount: 1,
    internshipStartDate: "2024-02-01",
    internshipEndDate: "2024-07-01",
    status: "active",
  },
  {
    id: "3",
    fullName: "Kofi Mensah",
    indexNumber: "003",
    email: "kofi@example.com",
    phone: "+233 20 456 7890",
    school: "USTED",
    townCity: "Accra",
    municipality: "Tema",
    mentorCount: 3,
    internshipStartDate: "2023-09-01",
    internshipEndDate: "2024-03-01",
    status: "completed",
  },
  {
    id: "4",
    fullName: "Abena Owusu",
    indexNumber: "004",
    email: "abena@example.com",
    phone: "+233 26 789 0123",
    school: "STEP",
    townCity: "Takoradi",
    municipality: "Sekondi-Takoradi Metropolitan",
    mentorCount: 1,
    internshipStartDate: "2024-03-01",
    internshipEndDate: "2024-09-01",
    status: "active",
  },
  {
    id: "5",
    fullName: "Yaw Bosompra",
    indexNumber: "005",
    email: "yaw@example.com",
    phone: "+233 24 321 0987",
    school: "USTED",
    townCity: "Accra",
    municipality: "Accra Metropolitan",
    mentorCount: 2,
    internshipStartDate: "2024-04-15",
    internshipEndDate: "2024-10-15",
    status: "pending",
  },
];

export default function StudentsPage() {
  const { isOpen, open, close } = useModal();
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive">("active");

  const filteredData = mockStudents.filter((s) =>
    statusFilter === "active" ? s.status !== "completed" : s.status === "completed"
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const tableColumns = [
    {
      key: "fullName",
      label: "Student Name",
      sortable: true,
    },
    {
      key: "email",
      label: "Student Email",
      sortable: true,
    },
    {
      key: "school",
      label: "School",
      sortable: true,
    },
    {
      key: "municipality",
      label: "Municipality",
      sortable: true,
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
      onClick: (row) => console.log("Edit student:", row),
    },
    {
      label: "Delete",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      ),
      onClick: (row) => console.log("Delete student:", row),
      variant: "danger",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Student Directory</h1>
        <div className="flex items-center gap-3">
          {/* Active / Inactive toggle */}
          <div className="flex items-center rounded-full border border-gray-300 overflow-hidden">
            <button
              onClick={() => { setStatusFilter("active"); setCurrentPage(1); }}
              className={`px-5 py-1.5 text-sm font-semibold transition-colors ${
                statusFilter === "active"
                  ? "bg-[#0891b2] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => { setStatusFilter("inactive"); setCurrentPage(1); }}
              className={`px-5 py-1.5 text-sm font-semibold transition-colors ${
                statusFilter === "inactive"
                  ? "bg-[#0891b2] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Inactive
            </button>
          </div>
          {/* Register button */}
          <button
            onClick={open}
            className="flex items-center gap-1.5 px-5 py-1.5 text-sm font-semibold rounded-full border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <span className="text-base leading-none">+</span> Register Student
          </button>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={tableColumns}
        data={paginatedData}
        rowIdKey="id"
        actions={tableActions}
        pagination={{
          currentPage,
          totalItems: filteredData.length,
          rowsPerPage,
          onPageChange: setCurrentPage,
          onRowsPerPageChange: (rpp) => {
            setRowsPerPage(rpp);
            setCurrentPage(1);
          },
          rowsPerPageOptions: [10, 20, 30, 50],
        }}
      />

      {/* Registration Modal */}
      <Modal isOpen={isOpen} onClose={close} title="Register New Student" size="lg">
        <div className="space-y-4">
          <p className="text-gray-600">
            Fill in the form below to register a new student intern to the system.
          </p>
          <div className="text-center py-8">
            <p className="text-gray-400">Registration form component coming soon...</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
