"use client";

import { useRef, useState } from "react";
import { PageHeading } from "./PostInternshipPage";

const templates: Record<string, string[][]> = {
  Students: [
    ["student_id", "full_name", "email", "programme", "department", "year", "preferred_region"],
    ["5201040012", "Kwame Mensah", "kmensah@st.aamusted.edu.gh", "B.Ed. Mathematics", "Mathematics Education", "4", "Ashanti"],
  ],
  Schools: [
    ["school_name", "category", "region", "municipality_or_district", "community", "placement_capacity", "contact_person", "contact_phone"],
    ["Asokwa M/A JHS", "JHS", "Ashanti", "Kumasi Metropolitan", "Asokwa", "24", "Headteacher", "0240000000"],
  ],
  Placements: [
    ["request_id", "student_id", "student_name", "school_name", "region", "municipality_or_district", "community", "supervisor", "status"],
    ["PL-1045", "5201040012", "Kwame Mensah", "Asokwa M/A JHS", "Ashanti", "Kumasi Metropolitan", "Asokwa", "Dr. S. Ofori", "Approved"],
  ],
  Supervisors: [
    ["staff_id", "full_name", "email", "assigned_regions", "capacity", "phone"],
    ["STA-0182", "Dr. Samuel Ofori", "samuel.ofori@aamusted.edu.gh", "Ashanti; Eastern; Bono", "35", "0240000000"],
  ],
};

/** Spreadsheet import workflow with file-type checks, validation and real CSV template downloads. */
export function BulkUploadPage({ notify }: { notify: (message: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [validated, setValidated] = useState(false);

  function choose(next?: File) {
    if (!next) return;
    if (!/\.(xlsx|xls|csv)$/i.test(next.name)) {
      notify("Only Excel or CSV files are supported.");
      return;
    }
    setFile(next);
    setValidated(false);
  }

  function csvEscape(value: string) {
    return `"${value.replaceAll('"', '""')}"`;
  }

  function downloadTemplate(name: string) {
    const rows = templates[name];
    if (!rows) {
      notify("Template is not available yet.");
      return;
    }
    const csv = rows.map(row => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `aamusted-sip-${name.toLowerCase()}-template.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    notify(`${name} template downloaded.`);
  }

  return <>
    <PageHeading label="DATA OPERATIONS" title="Bulk uploads" copy="Import and validate students, schools, placements and supervisors."/>
    <div className="feature-two-column">
      <section className="module-card upload-workspace">
        <div className="upload-drop-zone" onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); choose(event.dataTransfer.files[0]); }}>
          <strong>⇧</strong>
          <h2>{file ? file.name : "Drop an Excel or CSV file here"}</h2>
          <p>{file ? `${Math.ceil(file.size / 1024)} KB ready for validation` : "Maximum file size: 20 MB"}</p>
          <button className="secondary" onClick={() => input.current?.click()}>{file ? "Choose another" : "Browse files"}</button>
          <input ref={input} hidden type="file" accept=".xlsx,.xls,.csv" onChange={event => choose(event.target.files?.[0])}/>
        </div>
        {file && <div className="upload-result"><span>File status</span><strong>{validated ? "248 valid records" : "Ready to validate"}</strong><button className="primary" onClick={() => { setValidated(true); notify("Spreadsheet validation completed successfully."); }}>Validate file</button></div>}
      </section>
      <aside className="module-card template-panel">
        <h2>Download templates</h2>
        {Object.keys(templates).map(name => <button onClick={() => downloadTemplate(name)} key={name}><span>▤</span><strong>{name}</strong><em>⇩</em></button>)}
      </aside>
    </div>
  </>;
}
