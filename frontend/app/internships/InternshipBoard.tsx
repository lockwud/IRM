"use client";
import React, { useState } from "react";
import Button from "../components/Button";
import RegistrationModal from "./RegistrationModal";
import InternshipsTable from "./InternshipsTable";

const kanbanColumns = [
  { key: "registration", title: "Registration",  color: "#1B4FD8", bg: "var(--irm-badge-reg-bg)",  text: "var(--irm-badge-reg-text)"  },
  { key: "in_progress",  title: "In Progress",   color: "#D97706", bg: "var(--irm-badge-prog-bg)", text: "var(--irm-badge-prog-text)" },
  { key: "completed",    title: "Completed",     color: "#059669", bg: "var(--irm-badge-done-bg)", text: "var(--irm-badge-done-text)" },
];

const initialRecords = [
  { id: 1, mentee: { name: "Alice Johnson",   school: "Greenwood High",   email: "alice.johnson@example.com" }, mentor: { name: "Mr. Smith"      }, status: "registration", startDate: "2024-04-01", priority: "high"   as const },
  { id: 2, mentee: { name: "Bob Lee",         school: "Sunrise Academy",  email: "bob.lee@example.com"       }, mentor: { name: "Ms. Carter"     }, status: "in_progress",  startDate: "2024-03-15", priority: "medium" as const },
  { id: 3, mentee: { name: "Carol Williams",  school: "Central Tech",     email: "carol.w@example.com"       }, mentor: { name: "Dr. Adams"      }, status: "in_progress",  startDate: "2024-03-20", priority: "high"   as const },
  { id: 4, mentee: { name: "David Chen",      school: "Metro Institute",  email: "david.chen@example.com"    }, mentor: { name: "Prof. Martinez" }, status: "completed",    startDate: "2024-02-01", priority: "low"    as const },
  { id: 5, mentee: { name: "Emma Davis",      school: "Riverside School", email: "emma.d@example.com"        }, mentor: { name: "Mr. Johnson"    }, status: "registration", startDate: "2024-04-05", priority: "medium" as const },
  { id: 6, mentee: { name: "Frank Wilson",    school: "Greenwood High",   email: "frank.w@example.com"       }, mentor: { name: "Ms. Brown"      }, status: "in_progress",  startDate: "2024-03-25", priority: "high"   as const },
];

function PriorityBadge({ priority }: { priority: "high" | "medium" | "low" }) {
  const map = {
    high:   "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    low:    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide ${map[priority]}`}>
      {priority}
    </span>
  );
}

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
    setRecords([...records, { ...newRecord, id: newId, startDate: new Date().toISOString().split("T")[0], priority: "medium" }]);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-irm-text">Internships</h1>
          <p className="text-sm text-irm-text-muted mt-0.5">
            Manage and track all student internship registrations
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Active / Inactive toggle */}
          <div className="flex items-center rounded-md border border-irm-border overflow-hidden bg-irm-card">
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-4 py-2 text-sm font-medium transition-all ${
                statusFilter === "active"
                  ? "bg-irm-primary text-white"
                  : "text-irm-text-secondary hover:bg-irm-bg-hover"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter("inactive")}
              className={`px-4 py-2 text-sm font-medium transition-all ${
                statusFilter === "inactive"
                  ? "bg-irm-primary text-white"
                  : "text-irm-text-secondary hover:bg-irm-bg-hover"
              }`}
            >
              Inactive
            </button>
          </div>

          {/* Register button */}
          <Button onClick={() => setShowModal(true)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Register Internship
          </Button>
        </div>
      </div>

      {/* ── View toggle tabs ── */}
      <div className="flex gap-1 border-b border-irm-border">
        {(["table", "kanban"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-5 py-2.5 text-[13px] font-semibold transition-all border-b-2 -mb-px ${
              viewMode === mode
                ? "text-irm-primary border-irm-primary"
                : "text-irm-text-muted border-transparent hover:text-irm-text-secondary"
            }`}
          >
            {mode === "table" ? "Table View" : "Kanban View"}
          </button>
        ))}
      </div>

      {/* ── Table View ── */}
      {viewMode === "table" && (
        <InternshipsTable records={filteredRecords} onRecordClick={(r) => console.log("clicked", r)} />
      )}

      {/* ── Kanban View ── */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {kanbanColumns.map((col) => {
            const colRecords = filteredRecords.filter((r) => r.status === col.key);
            return (
              <div
                key={col.key}
                className="bg-irm-card border border-irm-border rounded-xl p-4"
                style={{ boxShadow: "var(--irm-shadow)" }}
              >
                {/* Column header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: col.color }}
                    />
                    <h3 className="text-[13px] font-bold text-irm-text">{col.title}</h3>
                  </div>
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: col.bg, color: col.text }}
                  >
                    {colRecords.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3">
                  {colRecords.length === 0 ? (
                    <div className="text-center py-8 text-irm-text-muted text-[13px]">
                      No records
                    </div>
                  ) : (
                    colRecords.map((r) => (
                      <div
                        key={r.id}
                        className="bg-irm-bg border border-irm-border rounded-xl p-3.5 hover:border-irm-primary/40 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-irm-primary to-irm-c2 flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-[10px] font-bold">
                                {r.mentee.name.split(" ").map(w => w[0]).join("")}
                              </span>
                            </div>
                            <span className="text-[13px] font-semibold text-irm-text">{r.mentee.name}</span>
                          </div>
                          <PriorityBadge priority={r.priority} />
                        </div>
                        <div className="space-y-1 pl-9">
                          <p className="text-[11px] text-irm-text-muted">{r.mentee.email}</p>
                          <p className="text-[12px] text-irm-text-secondary">
                            <span className="text-irm-text-muted">School:</span> {r.mentee.school}
                          </p>
                          <p className="text-[12px] text-irm-text-secondary">
                            <span className="text-irm-text-muted">Mentor:</span> {r.mentor.name}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Registration Modal */}
      {showModal && (
        <RegistrationModal onClose={() => setShowModal(false)} onRegister={handleRegister} />
      )}
    </div>
  );
}
