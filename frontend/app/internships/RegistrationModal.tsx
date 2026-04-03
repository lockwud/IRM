"use client";
import React, { useState } from "react";


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
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm relative">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400"
          onClick={onClose}
          aria-label="Close"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="5" x2="13" y2="13" />
            <line x1="13" y1="5" x2="5" y2="13" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Add Student</h2>
        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-200">
          <button
            type="button"
            className={`px-4 py-2 -mb-px border-b-2 font-medium text-sm focus:outline-none transition-colors ${activeTab === 'profile' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-gray-500 bg-gray-50 hover:text-blue-600'}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            type="button"
            className={`px-4 py-2 -mb-px border-b-2 font-medium text-sm focus:outline-none transition-colors ${activeTab === 'school' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-gray-500 bg-gray-50 hover:text-blue-600'}`}
            onClick={() => setActiveTab('school')}
          >
            School Records
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {activeTab === 'profile' && (
            <>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1 text-gray-700">Student Name <span className="text-red-500">*</span></label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                  placeholder="Enter student name"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1 text-gray-700">Contact <span className="text-red-500">*</span></label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  placeholder="Enter contact"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1 text-gray-700">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter email"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1 text-gray-700">Student Index <span className="text-red-500">*</span></label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={studentIndex}
                  onChange={(e) => setStudentIndex(e.target.value)}
                  required
                  placeholder="Enter student index"
                />
              </div>
            </>
          )}
          {activeTab === 'school' && (
            <>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1 text-gray-700">School of Internship <span className="text-red-500">*</span></label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={schoolOfInternship}
                  onChange={(e) => setSchoolOfInternship(e.target.value)}
                  required
                  placeholder="Enter school of internship"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1 text-gray-700">Town <span className="text-red-500">*</span></label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  required
                  placeholder="Enter town"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Municipality <span className="text-red-500">*</span></label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={municipality}
                  onChange={(e) => setMunicipality(e.target.value)}
                  required
                  placeholder="Enter municipality"
                />
              </div>
            </>
          )}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              className="px-5 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 font-medium shadow-sm"
            >
              <span className="text-lg font-bold">+</span> Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
