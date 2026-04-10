"use client";
import React, { useState } from "react";

export default function StudentRegistrationForm() {
  const [studentName, setStudentName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [studentIndex, setStudentIndex] = useState("");
  const [schoolOfInternship, setSchoolOfInternship] = useState("");
  const [town, setTown] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [program, setProgram] = useState("");
  const [level, setLevel] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit}>
      {submitted && (
        <div className="mb-4 p-4 rounded-xl bg-irm-success-light border border-irm-success/20 text-irm-success text-sm font-semibold flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Registration submitted successfully!
        </div>
      )}

      <h3 className="text-base font-bold text-irm-text mb-3">
        Personal Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-irm-text-secondary">
            Student Name <span className="text-irm-danger ml-0.5">*</span>
          </label>
          <input
            className="input"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            required
            placeholder="Enter full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-irm-text-secondary">
            Student Index <span className="text-irm-danger ml-0.5">*</span>
          </label>
          <input
            className="input"
            value={studentIndex}
            onChange={(e) => setStudentIndex(e.target.value)}
            required
            placeholder="Enter index number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-irm-text-secondary">
            Contact <span className="text-irm-danger ml-0.5">*</span>
          </label>
          <input
            className="input"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
            placeholder="Enter phone number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-irm-text-secondary">
            Email <span className="text-irm-danger ml-0.5">*</span>
          </label>
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter email address"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-irm-text-secondary">
            Program
          </label>
          <input
            className="input"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            placeholder="e.g. B.Ed. Basic Education"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-irm-text-secondary">
            Level
          </label>
          <input
            className="input"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            placeholder="e.g. Level 300"
          />
        </div>
      </div>

      <h3 className="text-base font-bold text-irm-text mb-3">
        School of Internship
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-irm-text-secondary">
            School Name <span className="text-irm-danger ml-0.5">*</span>
          </label>
          <input
            className="input"
            value={schoolOfInternship}
            onChange={(e) => setSchoolOfInternship(e.target.value)}
            required
            placeholder="Enter school name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-irm-text-secondary">
            Town <span className="text-irm-danger ml-0.5">*</span>
          </label>
          <input
            className="input"
            value={town}
            onChange={(e) => setTown(e.target.value)}
            required
            placeholder="Enter town"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-irm-text-secondary">
            Municipality <span className="text-irm-danger ml-0.5">*</span>
          </label>
          <input
            className="input"
            value={municipality}
            onChange={(e) => setMunicipality(e.target.value)}
            required
            placeholder="Enter municipality"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          className="px-5 py-2.5 rounded-xl bg-irm-bg text-irm-text-secondary hover:bg-irm-bg-hover border border-irm-border font-semibold text-sm transition-colors"
          onClick={() => {
            setStudentName("");
            setContact("");
            setEmail("");
            setStudentIndex("");
            setSchoolOfInternship("");
            setTown("");
            setMunicipality("");
            setProgram("");
            setLevel("");
          }}
        >
          Clear
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm shadow-sm transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#1B4FD8,#3B7CF4)", boxShadow: "0 2px 8px rgba(27,79,216,.35)" }}
        >
          Submit Registration
        </button>
      </div>
    </form>
  );
}
