import React from "react";
import StudentRegistrationForm from "./StudentRegistrationForm";

export default function RegistrationPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-irm-text">Student Internship Registration</h1>
        <p className="text-sm text-irm-text-muted mt-1">Register a new student for internship placement</p>
      </div>
      <div
        className="bg-irm-card border border-irm-border rounded-xl p-6"
        style={{ boxShadow: "var(--irm-shadow)" }}
      >
        <StudentRegistrationForm />
      </div>
    </div>
  );
}
