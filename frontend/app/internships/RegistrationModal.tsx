"use client";
import React, { useState } from "react";
import Button from "../components/Button";

interface RegistrationModalProps {
  onClose: () => void;
  onRegister: (record: any) => void;
}

export default function RegistrationModal({ onClose, onRegister }: RegistrationModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'school'>('profile');
  const [studentName, setStudentName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [studentIndex, setStudentIndex] = useState("");
  const [schoolOfInternship, setSchoolOfInternship] = useState("");
  const [town, setTown] = useState("");
  const [municipality, setMunicipality] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister({
      studentName,
      contact,
      email,
      studentIndex,
      schoolOfInternship,
      town,
      municipality,
    });
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: "rgba(7,20,40,0.7)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="bg-irm-card border border-irm-border rounded-xl w-full max-w-sm relative"
        style={{ boxShadow: "var(--irm-shadow-lg)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-irm-border">
          <h2 className="text-sm font-semibold text-irm-text">Register Student</h2>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-irm-bg-hover text-irm-text-muted hover:text-irm-text transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4l8 8M12 4l-8 8"/>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-irm-border px-6">
          {(["profile", "school"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 -mb-px text-sm font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? "border-irm-primary text-irm-primary"
                  : "border-transparent text-irm-text-muted hover:text-irm-text-secondary"
              }`}
            >
              {tab === "profile" ? "Profile" : "School Records"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {activeTab === "profile" && (
            <>
              {[
                { label: "Student Name",  val: studentName,   set: setStudentName,   ph: "Enter full name",     type: "text"  },
                { label: "Contact",       val: contact,       set: setContact,       ph: "Enter phone number",  type: "tel"   },
                { label: "Email",         val: email,         set: setEmail,         ph: "Enter email address", type: "email" },
                { label: "Student Index", val: studentIndex,  set: setStudentIndex,  ph: "Enter index number",  type: "text"  },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-xs font-semibold text-irm-text-secondary mb-1.5">
                    {f.label} <span className="text-irm-danger">*</span>
                  </label>
                  <input
                    type={f.type}
                    className="irm-input"
                    value={f.val}
                    onChange={(e) => f.set(e.target.value)}
                    required
                    placeholder={f.ph}
                  />
                </div>
              ))}
            </>
          )}

          {activeTab === "school" && (
            <>
              {[
                { label: "School of Internship", val: schoolOfInternship, set: setSchoolOfInternship, ph: "Enter school name"   },
                { label: "Town",                 val: town,               set: setTown,               ph: "Enter town"          },
                { label: "Municipality",          val: municipality,       set: setMunicipality,       ph: "Enter municipality"  },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-xs font-semibold text-irm-text-secondary mb-1.5">
                    {f.label} <span className="text-irm-danger">*</span>
                  </label>
                  <input
                    className="irm-input"
                    value={f.val}
                    onChange={(e) => f.set(e.target.value)}
                    required
                    placeholder={f.ph}
                  />
                </div>
              ))}
            </>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Student
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
