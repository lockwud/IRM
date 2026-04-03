import React from "react";
import StudentRegistrationForm from "./StudentRegistrationForm";

export default function RegistrationPage() {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-aamusted-gray min-h-screen">
      <h1 className="text-3xl font-bold text-aamusted-blue mb-6">Student Internship Registration</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <StudentRegistrationForm />
      </div>
    </div>
  );
}
