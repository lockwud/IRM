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
        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
          Registration submitted successfully!
        </div>
      )}

      <h3 className="text-lg font-semibold text-aamusted-blue mb-3">
        Personal Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Student Name <span className="text-red-500">*</span>
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
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Student Index <span className="text-red-500">*</span>
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
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Contact <span className="text-red-500">*</span>
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
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Email <span className="text-red-500">*</span>
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
          <label className="block text-sm font-medium mb-1 text-gray-700">
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
          <label className="block text-sm font-medium mb-1 text-gray-700">
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

      <h3 className="text-lg font-semibold text-aamusted-blue mb-3">
        School of Internship
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            School Name <span className="text-red-500">*</span>
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
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Town <span className="text-red-500">*</span>
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
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Municipality <span className="text-red-500">*</span>
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
          className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 font-medium"
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
          className="px-6 py-2 rounded-xl bg-aamusted-blue text-white hover:bg-aamusted-blue/90 font-semibold shadow-sm"
        >
          Submit Registration
        </button>
      </div>
    </form>
  );
}
