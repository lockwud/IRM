"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Table from "../../components/Table/Table";
import Select from "../../components/Form/Select";
import Button from "../../components/Button";
import Card from "../../components/Card";
import { IRMSRecord } from "../../lib/types";

// Mock data - replace with API call
const mockRecords: IRMSRecord[] = [
  {
    id: "1",
    studentId: "1",
    studentName: "Kwame Asante",
    recordNumber: "IRMS-2024-001",
    startDate: "2024-01-15",
    endDate: "2024-06-15",
    school: "USTED",
    mentor: "Mr. Addo",
    status: "approved",
    competencies: ["Communication", "Problem Solving", "Teamwork"],
    performanceIndicators: {
      "Technical Skills": 4,
      "Professional Conduct": 5,
      "Learning Ability": 4,
    },
    mentorComments: "Excellent performance throughout the internship",
    supervisorComments: "Approved for credit",
    createdAt: "2024-01-15",
    updatedAt: "2024-06-20",
  },
  {
    id: "2",
    studentId: "2",
    studentName: "Ama Boateng",
    recordNumber: "IRMS-2024-002",
    startDate: "2024-02-01",
    endDate: "2024-07-01",
    school: "STEP",
    mentor: "Ms. Owusu",
    status: "reviewed",
    competencies: ["Leadership", "Analysis"],
    performanceIndicators: {
      "Technical Skills": 3,
      "Professional Conduct": 4,
      "Learning Ability": 5,
    },
    mentorComments: "Good work overall",
    createdAt: "2024-02-01",
    updatedAt: "2024-07-05",
  },
  {
    id: "3",
    studentId: "4",
    studentName: "Abena Owusu",
    recordNumber: "IRMS-2024-003",
    startDate: "2024-03-01",
    endDate: "2024-09-01",
    school: "STEP",
    mentor: "Dr. Mensah",
    status: "submitted",
    competencies: [],
    performanceIndicators: {},
    createdAt: "2024-03-01",
    updatedAt: "2024-06-15",
  },
];

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  submitted: "bg-blue-100 text-blue-800",
  reviewed: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  archived: "bg-purple-100 text-purple-800",
};

export default function IRMSRecordsPage() {
  const [records, setRecords] = useState(mockRecords);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const filteredRecords = useMemo(() => {
    if (!statusFilter) return records;
    return records.filter((r) => r.status === statusFilter);
  }, [records, statusFilter]);

  const tableColumns = [
    {
      key: "recordNumber",
      label: "Record #",
      sortable: true,
      width: "120px",
      render: (value: string, row: IRMSRecord) => (
        <Link href={`/irms/records/${row.id}`} className="text-aamusted-blue hover:underline font-medium">
          {value}
        </Link>
      ),
    },
    {
      key: "studentName",
      label: "Student Name",
      sortable: true,
      width: "180px",
    },
    {
      key: "school",
      label: "School",
      sortable: true,
      width: "120px",
    },
    {
      key: "mentor",
      label: "Mentor",
      sortable: true,
      width: "120px",
    },
    {
      key: "startDate",
      label: "Period",
      sortable: false,
      render: (value: string, row: IRMSRecord) => (
        <span className="text-sm">
          {new Date(value).toLocaleDateString()} -{" "}
          {new Date(row.endDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      width: "110px",
      render: (value: string) => (
        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[value]}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">IRMS Records</h1>
          <p className="text-gray-600 mt-1">
            Manage internship record books and submissions
          </p>
        </div>
        <Link href="/irms/records/new">
          <Button variant="primary">
            + Create Record
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Records", value: records.length, color: "bg-blue-50 text-blue-700" },
          { label: "Approved", value: records.filter((r) => r.status === "approved").length, color: "bg-green-50 text-green-700" },
          { label: "Submitted", value: records.filter((r) => r.status === "submitted").length, color: "bg-yellow-50 text-yellow-700" },
          { label: "Draft", value: records.filter((r) => r.status === "draft").length, color: "bg-gray-50 text-gray-700" },
        ].map((stat) => (
          <Card key={stat.label} className="p-4">
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex items-end gap-4">
          <Select
            label="Filter by Status"
            options={[
              { value: "", label: "All Statuses" },
              { value: "draft", label: "Draft" },
              { value: "submitted", label: "Submitted" },
              { value: "reviewed", label: "Reviewed" },
              { value: "approved", label: "Approved" },
              { value: "archived", label: "Archived" },
            ]}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as string)}
            fullWidth={false}
          />
          {statusFilter && (
            <Button variant="ghost" size="sm" onClick={() => setStatusFilter("")}>
              Clear Filter
            </Button>
          )}
        </div>
      </Card>

      {/* Results Info */}
      <div className="text-sm text-gray-600">
        <p>
          Showing <span className="font-semibold">{filteredRecords.length}</span> of{" "}
          <span className="font-semibold">{records.length}</span> records
        </p>
      </div>

      {/* Table */}
      <Card className="overflow-hidden p-0">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No IRMS records found</p>
          </div>
        ) : (
          <Table columns={tableColumns} data={filteredRecords} rowIdKey="id" striped />
        )}
      </Card>
    </div>
  );
}
