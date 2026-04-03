// Student and Internship Types
export interface Student {
  id: string;
  fullName: string;
  indexNumber: string;
  email: string;
  phone: string;
  school: string;
  townCity: string;
  municipality: string;
  mentorCount: number;
  internshipStartDate?: string;
  internshipEndDate?: string;
  status: "active" | "inactive" | "completed" | "pending";
  createdAt?: string;
  updatedAt?: string;
}

export interface Mentor {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  school: string;
  department?: string;
  specialization?: string;
  studentsAssigned: number;
}

export interface School {
  id: string;
  name: string;
  town: string;
  municipality: string;
  address?: string;
  contact?: string;
  mentorsCount?: number;
  studentsCount?: number;
}

export interface Location {
  town: string;
  municipality: string;
}

export interface IRMSRecord {
  id: string;
  studentId: string;
  studentName: string;
  recordNumber: string;
  startDate: string;
  endDate: string;
  school: string;
  mentor: string;
  status: "draft" | "submitted" | "reviewed" | "approved" | "archived";
  competencies: string[];
  performanceIndicators: Record<string, number>;
  mentorComments?: string;
  supervisorComments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LessonNote {
  id: string;
  studentId: string;
  title: string;
  date: string;
  school: string;
  mentor: string;
  content: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FilterOptions {
  schools?: string[];
  towns?: string[];
  municipalities?: string[];
  status?: string[];
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}
