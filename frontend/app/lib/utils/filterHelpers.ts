import { Student, FilterOptions } from "../types";

/**
 * Filter students based on various criteria
 */
export function filterStudents(
  students: Student[],
  filters: FilterOptions
): Student[] {
  return students.filter((student) => {
    // Filter by schools
    if (filters.schools && filters.schools.length > 0) {
      if (!filters.schools.includes(student.school)) {
        return false;
      }
    }

    // Filter by towns
    if (filters.towns && filters.towns.length > 0) {
      if (!filters.towns.includes(student.townCity)) {
        return false;
      }
    }

    // Filter by municipalities
    if (filters.municipalities && filters.municipalities.length > 0) {
      if (!filters.municipalities.includes(student.municipality)) {
        return false;
      }
    }

    // Filter by status
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(student.status)) {
        return false;
      }
    }

    // Filter by date range
    if (filters.dateRange) {
      const studentDate = new Date(student.internshipStartDate || "");
      const startDate = new Date(filters.dateRange.startDate);
      const endDate = new Date(filters.dateRange.endDate);

      if (studentDate < startDate || studentDate > endDate) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Search students by name, email, phone, or index number
 */
export function searchStudents(
  students: Student[],
  query: string
): Student[] {
  const lowerQuery = query.toLowerCase();

  return students.filter(
    (student) =>
      student.fullName.toLowerCase().includes(lowerQuery) ||
      student.email.toLowerCase().includes(lowerQuery) ||
      student.phone.includes(query) ||
      student.indexNumber.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get unique values for filter options from students list
 */
export function getFilterOptions(students: Student[]) {
  const schools = Array.from(new Set(students.map((s) => s.school))).sort();
  const towns = Array.from(new Set(students.map((s) => s.townCity))).sort();
  const municipalities = Array.from(
    new Set(students.map((s) => s.municipality))
  ).sort();
  const statuses = Array.from(new Set(students.map((s) => s.status))).sort();

  return {
    schools: schools.map((s) => ({ value: s, label: s })),
    towns: towns.map((t) => ({ value: t, label: t })),
    municipalities: municipalities.map((m) => ({ value: m, label: m })),
    statuses: statuses.map((st) => ({ value: st, label: st })),
  };
}

/**
 * Sort students by a specific field
 */
export function sortStudents(
  students: Student[],
  sortBy: keyof Student,
  order: "asc" | "desc" = "asc"
): Student[] {
  const sorted = [...students].sort((a, b) => {
    const aVal = a[sortBy] ?? "";
    const bVal = b[sortBy] ?? "";

    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });

  return sorted;
}
