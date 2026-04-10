"use client";
import React, { useState } from "react";
import LessonNoteModal, { LessonNoteFormData } from "./LessonNoteModal";
import LessonNoteDetailModal from "./LessonNoteDetailModal";

export interface LessonNoteRecord extends LessonNoteFormData {
  id: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const SAMPLE_NOTES: LessonNoteRecord[] = [
  {
    id: "1",
    subject: "Mathematics",
    className: "B4",
    classSize: "32",
    weekEnding: "2026-04-10",
    daysInWeek: "5",
    day: "Monday",
    date: "2026-04-07",
    period: "1",
    lesson: "1",
    strand: "Number",
    subStrand: "Fractions",
    contentStandardCode: "B4.1.3.1",
    indicatorCode: "B4.1.3.1.1",
    performanceIndicator: "Pupils can identify and compare proper and improper fractions using concrete objects and pictorial representations.",
    keyWords: "Fraction, Numerator, Denominator, Proper, Improper",
    coreCompetencies: "Critical Thinking, Communication",
    tlrs: "Fraction cards, Fraction circles, Whiteboard",
    ref: "Curriculum pg. 45",
    phase1: "Display fraction cards on the board. Ask pupils: 'What do you notice about these numbers?' Allow 3-4 responses. Relate to sharing a pizza equally among friends.",
    phase2: "Introduce proper and improper fractions with examples. Pupils work in groups using fraction circles to model fractions. Teacher circulates and guides. Group activity: sort fraction cards into proper and improper sets. Class discussion of findings.",
    phase3: "Ask pupils to give one example of each type of fraction. Quick written exit ticket: 'Write one proper and one improper fraction.'",
    vettedBy: "Mrs. Adjei",
    tags: ["Mathematics", "B4", "Week 1"],
    createdAt: "2026-04-07",
    updatedAt: "2026-04-07",
  },
  {
    id: "2",
    subject: "English Language",
    className: "B5",
    classSize: "28",
    weekEnding: "2026-04-10",
    daysInWeek: "5",
    day: "Tuesday",
    date: "2026-04-08",
    period: "2",
    lesson: "2",
    strand: "Reading",
    subStrand: "Comprehension",
    contentStandardCode: "B5.2.1.1",
    indicatorCode: "B5.2.1.1.2",
    performanceIndicator: "Pupils can read a passage and answer inferential questions correctly.",
    keyWords: "Inference, Context, Passage, Main idea",
    coreCompetencies: "Critical Thinking, Communication, Creativity",
    tlrs: "Reading passage handouts, Comprehension question cards",
    ref: "English Learner Book pg. 62",
    phase1: "Show pupils a picture related to the passage topic. Ask: 'What do you think this text is about?' Encourage predictions and prior knowledge.",
    phase2: "Pupils read the passage silently then aloud in turns. Teacher asks guided questions to check understanding. Group work: answer inferential questions and justify answers from the text.",
    phase3: "Class shares answers. Teacher clarifies misconceptions. Pupils write a one-sentence summary of the main idea.",
    vettedBy: "Mr. Boateng",
    tags: ["English", "B5", "Reading"],
    createdAt: "2026-04-08",
    updatedAt: "2026-04-08",
  },
];

function StatusPill({ tags }: { tags: string[] }) {
  if (tags.length === 0) return <span className="text-irm-text-muted text-xs">—</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {tags.slice(0, 3).map((t) => (
        <span key={t} className="inline-block text-[11px] font-semibold text-irm-primary bg-blue-100 dark:bg-blue-900/30 rounded-full px-2.5 py-0.5">
          {t}
        </span>
      ))}
      {tags.length > 3 && (
        <span className="text-[11px] text-irm-text-muted">+{tags.length - 3}</span>
      )}
    </div>
  );
}

function nowDate() {
  return new Date().toISOString().slice(0, 10);
}

export default function NotesPage() {
  const [notes, setNotes] = useState<LessonNoteRecord[]>(SAMPLE_NOTES);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingNote, setEditingNote] = useState<LessonNoteRecord | null>(null);
  const [viewingNote, setViewingNote] = useState<LessonNoteRecord | null>(null);

  const filtered = notes.filter((n) => {
    const q = search.toLowerCase();
    return (
      n.subject.toLowerCase().includes(q) ||
      n.className.toLowerCase().includes(q) ||
      n.strand.toLowerCase().includes(q) ||
      n.subStrand.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const handleSave = (data: LessonNoteFormData) => {
    const tagsList = data.tags
      ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];
    if (editingNote) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingNote.id
            ? { ...data, id: editingNote.id, tags: tagsList, createdAt: editingNote.createdAt, updatedAt: nowDate() }
            : n
        )
      );
      setEditingNote(null);
      setViewingNote(null);
    } else {
      const newNote: LessonNoteRecord = {
        ...data,
        id: String(Date.now()),
        tags: tagsList,
        createdAt: nowDate(),
        updatedAt: nowDate(),
      };
      setNotes((prev) => [newNote, ...prev]);
      setShowCreate(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this lesson note?")) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const openEdit = (note: LessonNoteRecord) => {
    setViewingNote(null);
    setEditingNote(note);
  };

  return (
    <div className="p-4 md:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-irm-text">Lesson Notes</h1>
          <p className="text-sm text-irm-text-muted mt-0.5">{notes.length} note{notes.length !== 1 ? "s" : ""} total</p>
        </div>
        <div className="flex item-center gap-2">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-irm-text-muted pointer-events-none"
              width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search notes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="irm-input pl-9 py-2 text-sm w-56"
            />
          </div>
          <button
            onClick={() => { setEditingNote(null); setShowCreate(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-irm-primary text-white text-sm font-semibold hover:bg-irm-primary-hover transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Lesson Note
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-irm-card border border-irm-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-irm-border bg-irm-bg">
                <th className="text-left px-5 py-3 text-xs font-semibold text-irm-text-secondary uppercase tracking-wide">Subject</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-irm-text-secondary uppercase tracking-wide">Class</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-irm-text-secondary uppercase tracking-wide">Strand</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-irm-text-secondary uppercase tracking-wide">Sub-strand</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-irm-text-secondary uppercase tracking-wide">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-irm-text-secondary uppercase tracking-wide">Week Ending</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-irm-text-secondary uppercase tracking-wide">Tags</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-irm-text-secondary uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-irm-text-muted text-sm">
                    {search ? "No notes match your search." : "No lesson notes yet. Click \"New Lesson Note\" to create one."}
                  </td>
                </tr>
              )}
              {filtered.map((note) => (
                <tr
                  key={note.id}
                  onClick={() => setViewingNote(note)}
                  className="border-b border-irm-border last:border-0 hover:bg-irm-bg-hover cursor-pointer transition-colors group"
                >
                  <td className="px-5 py-3.5 font-semibold text-irm-text">{note.subject}</td>
                  <td className="px-5 py-3.5 text-irm-text-secondary">{note.className}</td>
                  <td className="px-5 py-3.5 text-irm-text-secondary">{note.strand}</td>
                  <td className="px-5 py-3.5 text-irm-text-secondary">{note.subStrand}</td>
                  <td className="px-5 py-3.5 text-irm-text-muted">{note.date}</td>
                  <td className="px-5 py-3.5 text-irm-text-muted">{note.weekEnding}</td>
                  <td className="px-5 py-3.5"><StatusPill tags={note.tags} /></td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEdit(note); }}
                        title="Edit"
                        className="p-1.5 rounded-lg hover:bg-irm-bg text-irm-text-secondary hover:text-irm-primary transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }}
                        title="Delete"
                        className="p-1.5 rounded-lg hover:bg-red-50 text-irm-text-secondary hover:text-red-600 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-irm-border text-xs text-irm-text-muted">
            Showing {filtered.length} of {notes.length} note{notes.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <LessonNoteModal
          onClose={() => setShowCreate(false)}
          onSave={handleSave}
        />
      )}

      {/* Edit Modal */}
      {editingNote && (
        <LessonNoteModal
          initial={{ ...editingNote, tags: editingNote.tags.join(", ") }}
          onClose={() => setEditingNote(null)}
          onSave={handleSave}
        />
      )}

      {/* Detail View Modal */}
      {viewingNote && !editingNote && (
        <LessonNoteDetailModal
          note={viewingNote}
          onClose={() => setViewingNote(null)}
          onEdit={() => openEdit(viewingNote)}
        />
      )}
    </div>
  );
}
