"use client";
import React, { useState } from "react";
import RegistrationModal from "./RegistrationModal";
import InternshipsTable from "./InternshipsTable";

// Example columns for internship stages
const kanbanColumns = [
  { key: "registration", title: "Registration" },
  { key: "in_progress", title: "In Progress" },
  { key: "completed", title: "Completed" },
];

// Example data structure for internship records with more realistic data
const initialRecords = [
  {
    id: 1,
    mentee: { name: "Alice Johnson", school: "Greenwood High", email: "alice.johnson@example.com" },
    mentor: { name: "Mr. Smith" },
    status: "registration",
    startDate: "2024-04-01",
    priority: "high" as const,
  },
  {
    id: 2,
    mentee: { name: "Bob Lee", school: "Sunrise Academy", email: "bob.lee@example.com" },
    mentor: { name: "Ms. Carter" },
    status: "in_progress",
    startDate: "2024-03-15",
    priority: "medium" as const,
  },
  {
    id: 3,
    mentee: { name: "Carol Williams", school: "Central Tech", email: "carol.w@example.com" },
    mentor: { name: "Dr. Adams" },
    status: "in_progress",
    startDate: "2024-03-20",
    priority: "high" as const,
  },
  {
    id: 4,
    mentee: { name: "David Chen", school: "Metro Institute", email: "david.chen@example.com" },
    mentor: { name: "Prof. Martinez" },
    status: "completed",
    startDate: "2024-02-01",
    endDate: "2024-03-30",
    priority: "low" as const,
  },
  {
    id: 5,
    mentee: { name: "Emma Davis", school: "Riverside School", email: "emma.d@example.com" },
    mentor: { name: "Mr. Johnson" },
    status: "registration",
    startDate: "2024-04-05",
    priority: "medium" as const,
  },
  {
    id: 6,
    mentee: { name: "Frank Wilson", school: "Greenwood High", email: "frank.w@example.com" },
    mentor: { name: "Ms. Brown" },
    status: "in_progress",
    startDate: "2024-03-25",
    priority: "high" as const,
  },
];

export default function InternshipBoard() {
  const [records, setRecords] = useState(initialRecords);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("table");
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive">("active");

  const filteredRecords = records.filter((r) =>
    statusFilter === "active" ? r.status !== "completed" : r.status === "completed"
  );

  const handleRegister = (newRecord: any) => {
    const newId = Math.max(...records.map(r => r.id), 0) + 1;
    setRecords([
      ...records,
      {
        ...newRecord,
        id: newId,
        startDate: new Date().toISOString().split("T")[0],
        priority: "medium",
      },
    ]);
    setShowModal(false);
  };

  const handleRecordClick = (record: any) => {
    console.log("Record clicked:", record);
    // Handle record click - could open detail view, edit modal, etc.
  };

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Internships</h1>
        <div className="flex items-center gap-3">
          {/* Active / Inactive toggle */}
          <div className="flex items-center rounded-full border border-gray-300 overflow-hidden">
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-5 py-1.5 text-sm font-semibold transition-colors ${
                statusFilter === "active"
                  ? "bg-[#0891b2] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter("inactive")}
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
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-5 py-1.5 text-sm font-semibold rounded-full border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <span className="text-base leading-none">+</span> Register Internship
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setViewMode("table")}
          className={`px-4 py-2 font-semibold transition-colors ${
            viewMode === "table"
              ? "text-aamusted-blue border-b-2 border-aamusted-blue"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Table View
        </button>
        <button
          onClick={() => setViewMode("kanban")}
          className={`px-4 py-2 font-semibold transition-colors ${
            viewMode === "kanban"
              ? "text-aamusted-blue border-b-2 border-aamusted-blue"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Kanban View
        </button>
      </div>

      {/* Table View */}
      {viewMode === "table" && (
        <InternshipsTable records={filteredRecords} onRecordClick={handleRecordClick} />
      )}

      {/* Kanban View */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {kanbanColumns.map((col) => (
            <div key={col.key} className="bg-gray-50 rounded p-3 min-h-[300px]">
              <h2 className="font-semibold mb-3 text-gray-700">{col.title}</h2>
              {filteredRecords.filter((r) => r.status === col.key).length === 0 ? (
                <div className="text-gray-400 text-sm">No records</div>
              ) : (
                filteredRecords
                  .filter((r) => r.status === col.key)
                  .map((r) => (
                    <div
                      key={r.id}
                      className="bg-white rounded shadow p-3 mb-3 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleRecordClick(r)}
                    >
                      <div className="font-medium text-blue-700">{r.mentee.name}</div>
                      <div className="text-xs text-gray-600 mt-1">{r.mentee.email}</div>
                      <div className="text-sm text-gray-600 mt-2">School: {r.mentee.school}</div>
                      <div className="text-sm text-gray-600">Mentor: {r.mentor.name}</div>
                    </div>
                  ))
              )}
            </div>
          ))}
        </div>
      )}

      {/* Registration Modal */}
      {showModal && (
        <RegistrationModal
          onClose={() => setShowModal(false)}
          onRegister={handleRegister}
        />
      )}
    </div>
  );
}
