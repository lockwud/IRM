"use client";
import { useState, use } from "react";
import Link from "next/link";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Input from "../../../components/Form/Input";
import Textarea from "../../../components/Form/Textarea";
import Select from "../../../components/Form/Select";

// Mock data - replace with API call
const mockRecord = {
  id: "1",
  recordNumber: "IRMS-2024-001",
  studentName: "Kwame Asante",
  studentId: "1",
  school: "USTED",
  mentor: "Mr. Addo",
  startDate: "2024-01-15",
  endDate: "2024-06-15",
  status: "approved" as const,
  competencies: ["Communication", "Problem Solving", "Teamwork", "Leadership"],
  performanceIndicators: {
    "Technical Skills": 4,
    "Professional Conduct": 5,
    "Learning Ability": 4,
  },
  mentorComments: "Excellent performance throughout the internship. The student demonstrated remarkable growth in technical competencies and professional behavior.",
  supervisorComments: "Approved for credit. All requirements met.",
  createdAt: "2024-01-15",
  updatedAt: "2024-06-20",
};

const statusColors: Record<string, string> = {
  draft: "bg-irm-bg-hover text-irm-text",
  submitted: "bg-blue-100 text-blue-800",
  reviewed: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  archived: "bg-purple-100 text-purple-800",
};

export default function IRMSRecordDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [record, setRecord] = useState(mockRecord);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link href="/irms/records" className="text-irm-primary hover:underline text-sm mb-2 inline-block">
            ← Back to Records
          </Link>
          <h1 className="text-3xl font-bold text-irm-text">{record.recordNumber}</h1>
          <p className="text-irm-text-secondary mt-1">{record.studentName} • {record.school}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isEditing ? "secondary" : "outline"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>
          <span className={`inline-block px-3 py-2 rounded-full text-sm font-semibold ${statusColors[record.status]}`}>
            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Record Information */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-irm-text mb-4">Record Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-irm-text-secondary">Student Name</p>
            <p className="font-semibold text-irm-text">{record.studentName}</p>
          </div>
          <div>
            <p className="text-sm text-irm-text-secondary">Record Number</p>
            <p className="font-semibold text-irm-text">{record.recordNumber}</p>
          </div>
          <div>
            <p className="text-sm text-irm-text-secondary">School</p>
            <p className="font-semibold text-irm-text">{record.school}</p>
          </div>
          <div>
            <p className="text-sm text-irm-text-secondary">Mentor</p>
            <p className="font-semibold text-irm-text">{record.mentor}</p>
          </div>
          <div>
            <p className="text-sm text-irm-text-secondary">Internship Period</p>
            <p className="font-semibold text-irm-text">
              {new Date(record.startDate).toLocaleDateString()} - {new Date(record.endDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-irm-text-secondary">Duration</p>
            <p className="font-semibold text-irm-text">
              {Math.floor((new Date(record.endDate).getTime() - new Date(record.startDate).getTime()) / (1000 * 60 * 60 * 24)) / 30} months
            </p>
          </div>
        </div>
      </Card>

      {/* Competencies */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-irm-text mb-4">Competencies Assessed</h2>
        <div className="flex flex-wrap gap-2">
          {record.competencies.map((comp) => (
            <span key={comp} className="px-3 py-1.5 bg-aamusted-gold/20 text-irm-primary rounded-full text-sm font-medium">
              {comp}
            </span>
          ))}
        </div>
      </Card>

      {/* Performance Indicators */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-irm-text mb-4">Performance Indicators</h2>
        <div className="space-y-4">
          {Object.entries(record.performanceIndicators).map(([indicator, rating]) => (
            <div key={indicator}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-irm-text-secondary">{indicator}</p>
                <span className="text-sm font-semibold text-irm-primary">{rating}/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-aamusted-gold h-2 rounded-full transition-all"
                  style={{ width: `${(rating / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Comments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-bold text-irm-text mb-4">Mentor Comments</h2>
          <p className="text-irm-text-secondary">{record.mentorComments || "No comments provided"}</p>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-bold text-irm-text mb-4">Supervisor Comments</h2>
          <p className="text-irm-text-secondary">{record.supervisorComments || "No comments provided"}</p>
        </Card>
      </div>

      {/* Actions */}
      {(record.status as string) === "submitted" && (
        <Card className="p-6 bg-blue-50 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-4">Supervisor Actions</h3>
          <div className="flex gap-2">
            <Button variant="primary">
              Approve Record
            </Button>
            <Button variant="outline">
              Request Changes
            </Button>
          </div>
        </Card>
      )}

      {/* Metadata */}
      <Card className="p-6 bg-irm-bg">
        <p className="text-xs text-irm-text-muted">
          Created: {new Date(record.createdAt).toLocaleString()} • Last updated: {new Date(record.updatedAt).toLocaleString()}
        </p>
      </Card>
    </div>
  );
}
