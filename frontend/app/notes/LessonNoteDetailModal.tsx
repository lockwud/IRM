"use client";
import React from "react";
import type { LessonNoteRecord } from "./page";

interface LessonNoteDetailModalProps {
  note: LessonNoteRecord;
  onClose: () => void;
  onEdit: () => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h3 className="text-xs font-bold text-irm-primary uppercase tracking-wider mb-3 pb-1 border-b border-irm-border">
        {title}
      </h3>
      {children}
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5 mb-2">
      <span className="text-[10px] font-semibold text-irm-text-muted uppercase tracking-wider">{label}</span>
      <span className="text-sm text-irm-text">{value}</span>
    </div>
  );
}

function PhaseBox({ number, title, content }: { number: number; title: string; content: string }) {
  return (
    <div className="rounded-xl border border-irm-border bg-irm-bg p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-6 h-6 rounded-full bg-irm-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
          {number}
        </span>
        <span className="text-xs font-semibold text-irm-text-secondary">{title}</span>
      </div>
      <p className="text-sm text-irm-text whitespace-pre-wrap leading-relaxed">{content || <span className="text-irm-text-muted italic">—</span>}</p>
    </div>
  );
}

export default function LessonNoteDetailModal({ note, onClose, onEdit }: LessonNoteDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(7,20,40,0.75)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-irm-card border border-irm-border rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto"
        style={{ boxShadow: "var(--irm-shadow-lg)" }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-irm-card z-10 flex items-center justify-between px-6 py-4 border-b border-irm-border rounded-t-2xl">
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-irm-text truncate">{note.subject} — {note.strand}</h2>
            <p className="text-xs text-irm-text-muted mt-0.5">
              {note.className} &bull; {note.date} &bull; Week Ending: {note.weekEnding}
            </p>
          </div>
          <div className="flex items-center gap-2 ml-4 shrink-0">
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-irm-border text-irm-text-secondary hover:bg-irm-bg-hover text-xs font-medium transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-irm-bg-hover text-irm-text-muted hover:text-irm-text rounded-xl transition-colors"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Tags */}
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {note.tags.map((tag) => (
                <span key={tag} className="text-xs font-semibold text-irm-primary bg-blue-100 dark:bg-blue-900/30 rounded-full px-3 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Class Information */}
          <Section title="Class Information">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2">
              <DetailRow label="Subject" value={note.subject} />
              <DetailRow label="Class" value={note.className} />
              <DetailRow label="Class Size" value={note.classSize} />
              <DetailRow label="Week Ending" value={note.weekEnding} />
              <DetailRow label="Days in Week" value={note.daysInWeek} />
              <DetailRow label="Day" value={note.day} />
              <DetailRow label="Date" value={note.date} />
              <DetailRow label="Period" value={note.period} />
              <DetailRow label="Lesson" value={note.lesson} />
            </div>
          </Section>

          {/* Curriculum Details */}
          <Section title="Curriculum Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-3">
              <DetailRow label="Strand" value={note.strand} />
              <DetailRow label="Sub-strand" value={note.subStrand} />
              <DetailRow label="Content Standard (Code)" value={note.contentStandardCode} />
              <DetailRow label="Indicator (Code)" value={note.indicatorCode} />
            </div>
            {note.performanceIndicator && (
              <div className="mb-3">
                <span className="text-[10px] font-semibold text-irm-text-muted uppercase tracking-wider block mb-1">Performance Indicator</span>
                <p className="text-sm text-irm-text bg-irm-bg border border-irm-border rounded-lg px-4 py-3 whitespace-pre-wrap leading-relaxed">
                  {note.performanceIndicator}
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {note.keyWords && (
                <div>
                  <span className="text-[10px] font-semibold text-irm-text-muted uppercase tracking-wider block mb-1">Key Words</span>
                  <p className="text-sm text-irm-text bg-irm-bg border border-irm-border rounded-lg px-4 py-3 whitespace-pre-wrap">{note.keyWords}</p>
                </div>
              )}
              {note.coreCompetencies && (
                <div>
                  <span className="text-[10px] font-semibold text-irm-text-muted uppercase tracking-wider block mb-1">Core Competencies</span>
                  <p className="text-sm text-irm-text bg-irm-bg border border-irm-border rounded-lg px-4 py-3 whitespace-pre-wrap">{note.coreCompetencies}</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {note.tlrs && (
                <div>
                  <span className="text-[10px] font-semibold text-irm-text-muted uppercase tracking-wider block mb-1">TLR(s)</span>
                  <p className="text-sm text-irm-text bg-irm-bg border border-irm-border rounded-lg px-4 py-3 whitespace-pre-wrap">{note.tlrs}</p>
                </div>
              )}
              {note.ref && (
                <div>
                  <span className="text-[10px] font-semibold text-irm-text-muted uppercase tracking-wider block mb-1">Reference / Ref.</span>
                  <p className="text-sm text-irm-text bg-irm-bg border border-irm-border rounded-lg px-4 py-3">{note.ref}</p>
                </div>
              )}
            </div>
          </Section>

          {/* Lesson Phases */}
          <Section title="Lesson Phases">
            <div className="space-y-3">
              <PhaseBox
                number={1}
                title="Starter – Preparing the brain for learning"
                content={note.phase1}
              />
              <PhaseBox
                number={2}
                title="Main – New learning including assessment"
                content={note.phase2}
              />
              <PhaseBox
                number={3}
                title="Plenary / Reflections"
                content={note.phase3}
              />
            </div>
          </Section>

          {/* Footer */}
          {note.vettedBy && (
            <Section title="Vetting">
              <div className="flex items-center gap-8">
                <DetailRow label="Vetted By" value={note.vettedBy} />
                <DetailRow label="Signature" value="—" />
              </div>
            </Section>
          )}

          {/* Meta */}
          <div className="flex items-center justify-between pt-4 border-t border-irm-border text-xs text-irm-text-muted">
            <span>Created: {note.createdAt}</span>
            <span>Last updated: {note.updatedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
