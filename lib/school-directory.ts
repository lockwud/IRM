export type DirectorySchool = {
  id: string;
  name: string;
  region: string;
  municipality: string;
  community: string;
  category: "Primary" | "JHS" | "Basic" | "SHS" | "TVET" | "Technical";
  ownership: "Government" | "Private" | "Mission";
  interns: number;
  capacity: number;
  status: "Active" | "Pending" | "Inactive";
};

export const fallbackSchools: DirectorySchool[] = [
  { id: "SCH-001", name: "Asokwa M/A JHS", region: "Ashanti", municipality: "Kumasi Metropolitan", community: "Asokwa", category: "JHS", ownership: "Government", interns: 18, capacity: 24, status: "Active" },
  { id: "SCH-002", name: "Kumasi Technical Institute", region: "Ashanti", municipality: "Kumasi Metropolitan", community: "Amakom", category: "TVET", ownership: "Government", interns: 16, capacity: 30, status: "Active" },
  { id: "SCH-003", name: "Kumasi Technical SHS", region: "Ashanti", municipality: "Kumasi Metropolitan", community: "Atonsu", category: "Technical", ownership: "Government", interns: 16, capacity: 18, status: "Active" },
  { id: "SCH-004", name: "St. Louis Senior High School", region: "Ashanti", municipality: "Oforikrom Municipal", community: "Oduom", category: "SHS", ownership: "Mission", interns: 12, capacity: 15, status: "Active" },
  { id: "SCH-005", name: "Wesley College Demonstration School", region: "Ashanti", municipality: "Kumasi Metropolitan", community: "Asokwa", category: "Basic", ownership: "Government", interns: 23, capacity: 28, status: "Active" },
  { id: "SCH-006", name: "Tanoso Anglican Primary School", region: "Bono East", municipality: "Techiman Municipal", community: "Tanoso", category: "Primary", ownership: "Government", interns: 4, capacity: 12, status: "Active" },
  { id: "SCH-007", name: "Tanoso D/A JHS", region: "Bono East", municipality: "Techiman Municipal", community: "Tanoso", category: "JHS", ownership: "Government", interns: 6, capacity: 14, status: "Active" },
  { id: "SCH-008", name: "Tanoso Community SHS", region: "Bono East", municipality: "Techiman Municipal", community: "Tanoso", category: "SHS", ownership: "Government", interns: 8, capacity: 20, status: "Active" },
  { id: "SCH-009", name: "Tanoso Technical Institute", region: "Bono East", municipality: "Techiman Municipal", community: "Tanoso", category: "TVET", ownership: "Government", interns: 5, capacity: 18, status: "Active" },
  { id: "SCH-010", name: "Asuofua M/A Basic School", region: "Ashanti", municipality: "Atwima Nwabiagya Municipal", community: "Asuofua", category: "Basic", ownership: "Government", interns: 5, capacity: 12, status: "Active" },
  { id: "SCH-011", name: "Barekese D/A JHS", region: "Ashanti", municipality: "Atwima Nwabiagya North District", community: "Barekese", category: "JHS", ownership: "Government", interns: 3, capacity: 10, status: "Active" },
  { id: "SCH-012", name: "Prempeh College", region: "Ashanti", municipality: "Kumasi Metropolitan", community: "Sofoline", category: "SHS", ownership: "Government", interns: 9, capacity: 18, status: "Active" },
  { id: "SCH-013", name: "Opoku Ware School", region: "Ashanti", municipality: "Kumasi Metropolitan", community: "Santasi", category: "SHS", ownership: "Mission", interns: 7, capacity: 16, status: "Active" },
  { id: "SCH-014", name: "Akropong D/A JHS", region: "Eastern", municipality: "Akuapem North Municipal", community: "Akropong", category: "JHS", ownership: "Government", interns: 11, capacity: 16, status: "Active" },
  { id: "SCH-015", name: "Presbyterian Senior High Technical School", region: "Eastern", municipality: "Akuapem North Municipal", community: "Larteh", category: "Technical", ownership: "Mission", interns: 4, capacity: 12, status: "Active" },
  { id: "SCH-016", name: "Koforidua Technical Institute", region: "Eastern", municipality: "New Juaben South Municipal", community: "Koforidua", category: "TVET", ownership: "Government", interns: 6, capacity: 18, status: "Active" },
  { id: "SCH-017", name: "Sunyani Senior High School", region: "Bono", municipality: "Sunyani Municipal", community: "New Town", category: "SHS", ownership: "Government", interns: 14, capacity: 20, status: "Active" },
  { id: "SCH-018", name: "Sunyani Technical Institute", region: "Bono", municipality: "Sunyani Municipal", community: "Magazine", category: "TVET", ownership: "Government", interns: 8, capacity: 20, status: "Active" },
  { id: "SCH-019", name: "Cape Coast Technical Institute", region: "Central", municipality: "Cape Coast Metropolitan", community: "Cape Coast", category: "TVET", ownership: "Government", interns: 6, capacity: 15, status: "Active" },
  { id: "SCH-020", name: "Mfantsipim School", region: "Central", municipality: "Cape Coast Metropolitan", community: "Cape Coast", category: "SHS", ownership: "Mission", interns: 5, capacity: 12, status: "Active" },
  { id: "SCH-021", name: "Accra Technical Training Centre", region: "Greater Accra", municipality: "Accra Metropolitan", community: "Kokomlemle", category: "TVET", ownership: "Government", interns: 8, capacity: 25, status: "Active" },
  { id: "SCH-022", name: "Accra High School", region: "Greater Accra", municipality: "Accra Metropolitan", community: "North Ridge", category: "SHS", ownership: "Government", interns: 7, capacity: 18, status: "Active" },
  { id: "SCH-023", name: "Tema Technical Institute", region: "Greater Accra", municipality: "Tema Metropolitan", community: "Community 5", category: "TVET", ownership: "Government", interns: 6, capacity: 18, status: "Active" },
  { id: "SCH-024", name: "Tamale Technical Institute", region: "Northern", municipality: "Tamale Metropolitan", community: "Lamashegu", category: "TVET", ownership: "Government", interns: 5, capacity: 16, status: "Active" },
  { id: "SCH-025", name: "Ho Technical Institute", region: "Volta", municipality: "Ho Municipal", community: "Ho Bankoe", category: "TVET", ownership: "Government", interns: 5, capacity: 14, status: "Active" },
  { id: "SCH-026", name: "Sekondi College", region: "Western", municipality: "Sekondi Takoradi Metropolitan", community: "Sekondi", category: "SHS", ownership: "Government", interns: 5, capacity: 14, status: "Active" },
  { id: "SCH-027", name: "Takoradi Technical Institute", region: "Western", municipality: "Sekondi Takoradi Metropolitan", community: "Takoradi", category: "TVET", ownership: "Government", interns: 6, capacity: 16, status: "Active" },
  { id: "SCH-028", name: "Galaxy International School", region: "Greater Accra", municipality: "Adentan Municipal", community: "Ashaley Botwe", category: "Basic", ownership: "Private", interns: 2, capacity: 8, status: "Active" },
  { id: "SCH-029", name: "Morning Star School", region: "Greater Accra", municipality: "Accra Metropolitan", community: "Cantonments", category: "Basic", ownership: "Private", interns: 2, capacity: 8, status: "Active" },
  { id: "SCH-030", name: "Kaasi Montessori School", region: "Ashanti", municipality: "Asokwa Municipal", community: "Kaase", category: "Basic", ownership: "Private", interns: 2, capacity: 8, status: "Active" },
  { id: "SCH-031", name: "Goaso Senior High School", region: "Ahafo", municipality: "Asunafo North Municipal", community: "Goaso", category: "SHS", ownership: "Government", interns: 4, capacity: 14, status: "Active" },
  { id: "SCH-032", name: "Kenyasi Technical Institute", region: "Ahafo", municipality: "Asutifi North District", community: "Kenyasi", category: "TVET", ownership: "Government", interns: 3, capacity: 12, status: "Active" },
  { id: "SCH-033", name: "Techiman Senior High School", region: "Bono East", municipality: "Techiman Municipal", community: "Techiman", category: "SHS", ownership: "Government", interns: 7, capacity: 18, status: "Active" },
  { id: "SCH-034", name: "Dambai College of Education Demonstration Basic School", region: "Oti", municipality: "Krachi East Municipal", community: "Dambai", category: "Basic", ownership: "Government", interns: 3, capacity: 10, status: "Active" },
  { id: "SCH-035", name: "Nkwanta Senior High School", region: "Oti", municipality: "Nkwanta South Municipal", community: "Nkwanta", category: "SHS", ownership: "Government", interns: 4, capacity: 12, status: "Active" },
  { id: "SCH-036", name: "Damongo Senior High School", region: "Savannah", municipality: "West Gonja Municipal", community: "Damongo", category: "SHS", ownership: "Government", interns: 4, capacity: 12, status: "Active" },
  { id: "SCH-037", name: "Salaga T.I. Ahmadiyya Senior High School", region: "Savannah", municipality: "East Gonja Municipal", community: "Salaga", category: "SHS", ownership: "Mission", interns: 4, capacity: 12, status: "Active" },
  { id: "SCH-038", name: "Bolgatanga Technical Institute", region: "Upper East", municipality: "Bolgatanga Municipal", community: "Bolgatanga", category: "TVET", ownership: "Government", interns: 5, capacity: 15, status: "Active" },
  { id: "SCH-039", name: "Bawku Technical Institute", region: "Upper East", municipality: "Bawku Municipal", community: "Bawku", category: "TVET", ownership: "Government", interns: 4, capacity: 12, status: "Active" },
  { id: "SCH-040", name: "Wa Senior High Technical School", region: "Upper West", municipality: "Wa Municipal", community: "Wa Central", category: "Technical", ownership: "Government", interns: 5, capacity: 15, status: "Active" },
  { id: "SCH-041", name: "Nandom Senior High School", region: "Upper West", municipality: "Nandom Municipal", community: "Nandom", category: "SHS", ownership: "Government", interns: 3, capacity: 10, status: "Active" },
  { id: "SCH-042", name: "Sefwi Wiawso Senior High Technical School", region: "Western North", municipality: "Sefwi Wiawso Municipal", community: "Sefwi Wiawso", category: "Technical", ownership: "Government", interns: 5, capacity: 14, status: "Active" },
  { id: "SCH-043", name: "Bibiani Senior High Technical School", region: "Western North", municipality: "Bibiani-Anhwiaso-Bekwai Municipal", community: "Bibiani", category: "Technical", ownership: "Government", interns: 5, capacity: 14, status: "Active" },
  { id: "SCH-044", name: "Walewale Senior High Technical School", region: "North East", municipality: "West Mamprusi Municipal", community: "Walewale", category: "Technical", ownership: "Government", interns: 4, capacity: 12, status: "Active" },
  { id: "SCH-045", name: "Nalerigu Senior High School", region: "North East", municipality: "East Mamprusi Municipal", community: "Nalerigu", category: "SHS", ownership: "Government", interns: 4, capacity: 12, status: "Active" },
];

export function schoolToPlacementOption(school: DirectorySchool) {
  return {
    name: school.name,
    municipality: school.municipality,
    community: school.community,
    region: school.region,
    spaces: Math.max(0, school.capacity - school.interns),
  };
}
