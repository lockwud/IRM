"use client";
import React, { useState } from "react";

export interface LessonNoteFormData {
  id?: string;
  subject: string;
  className: string;
  classSize: string;
  weekEnding: string;
  daysInWeek: string;
  day: string;
  date: string;
  period: string;
  lesson: string;
  strand: string;
  subStrand: string;
  contentStandardCode: string;
  indicatorCode: string;
  performanceIndicator: string;
  keyWords: string;
  coreCompetencies: string;
  tlrs: string;
  ref: string;
  phase1: string;
  phase2: string;
  phase3: string;
  vettedBy: string;
  tags: string;
}

const emptyForm: LessonNoteFormData = {
  subject: "",
  className: "",
  classSize: "",
  weekEnding: "",
  daysInWeek: "",
  day: "",
  date: "",
  period: "",
  lesson: "",
  strand: "",
  subStrand: "",
  contentStandardCode: "",
  indicatorCode: "",
  performanceIndicator: "",
  keyWords: "",
  coreCompetencies: "",
  tlrs: "",
  ref: "",
  phase1: "",
  phase2: "",
  phase3: "",
  vettedBy: "",
  tags: "",
};

interface LessonNoteModalProps {
  initial?: Partial<LessonNoteFormData>;
  onClose: () => void;
  onSave: (data: LessonNoteFormData) => void;
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
}: {
  label: string;
  name: keyof LessonNoteFormData;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: "text" | "date" | "number";
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-irm-text-secondary mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        required={required}
        className="irm-input w-full"
      />
    </div>
  );
}

function TextAreaField({
  label,
  name,
  value,
  onChange,
  rows = 3,
  placeholder = "",
  required = false,
}: {
  label: string;
  name: keyof LessonNoteFormData;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  rows?: number;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-irm-text-secondary mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder || label}
        required={required}
        className="irm-input w-full resize-none"
      />
    </div>
  );
}

export default function LessonNoteModal({ initial, onClose, onSave }: LessonNoteModalProps) {
  const [form, setForm] = useState<LessonNoteFormData>({ ...emptyForm, ...initial });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "date" && value) {
      const dayName = new Date(value + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" });
      setForm((prev) => ({ ...prev, date: value, day: dayName }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

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
          <div>
            <h2 className="text-base font-bold text-irm-text">{initial?.id ? "Edit Lesson Note" : "New Lesson Note"}</h2>
            <p className="text-xs text-irm-text-muted mt-0.5">Fill in the lesson plan details below</p>
          </div>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section: Header Info */}
          <section>
            <h3 className="text-xs font-bold text-irm-primary uppercase tracking-wider mb-3 pb-1 border-b border-irm-border">
              Class Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Field label="Subject" name="subject" value={form.subject} onChange={handleChange} required />
              <Field label="Class" name="className" value={form.className} onChange={handleChange} required />
              <Field label="Class Size" name="classSize" value={form.classSize} onChange={handleChange} type="number" />
              <div className="col-span-1">
                <label className="block text-xs font-semibold text-irm-text-secondary mb-1">Week Ending</label>
                <input
                  type="date"
                  name="weekEnding"
                  value={form.weekEnding}
                  onChange={handleChange}
                  title="Week Ending"
                  placeholder="Week Ending"
                  className="irm-input w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
              <Field label="Days in Week" name="daysInWeek" value={form.daysInWeek} onChange={handleChange} type="number" placeholder="e.g. 5" />
              <Field label="Date" name="date" value={form.date} onChange={handleChange} type="date" required />
              <div>
                <label className="block text-xs font-semibold text-irm-text-secondary mb-1">Day</label>
                <input
                  type="text"
                  name="day"
                  value={form.day}
                  onChange={handleChange}
                  placeholder="Auto-filled from date"
                  className="irm-input w-full bg-irm-bg"
                  readOnly={!!form.date}
                />
              </div>
              <Field label="Period" name="period" value={form.period} onChange={handleChange} placeholder="e.g. 1" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
              <Field label="Lesson" name="lesson" value={form.lesson} onChange={handleChange} placeholder="e.g. 1" />
            </div>
          </section>

          {/* Section: Curriculum Details */}
          <section>
            <h3 className="text-xs font-bold text-irm-primary uppercase tracking-wider mb-3 pb-1 border-b border-irm-border">
              Curriculum Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Strand" name="strand" value={form.strand} onChange={handleChange} required />
              <Field label="Sub-strand" name="subStrand" value={form.subStrand} onChange={handleChange} required />
              <Field label="Content Standard (Code)" name="contentStandardCode" value={form.contentStandardCode} onChange={handleChange} />
              <Field label="Indicator (Code)" name="indicatorCode" value={form.indicatorCode} onChange={handleChange} />
            </div>
            <div className="mt-3">
              <TextAreaField label="Performance Indicator" name="performanceIndicator" value={form.performanceIndicator} onChange={handleChange} rows={2} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <TextAreaField label="Key Words" name="keyWords" value={form.keyWords} onChange={handleChange} rows={2} />
              <TextAreaField label="Core Competencies" name="coreCompetencies" value={form.coreCompetencies} onChange={handleChange} rows={2} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <TextAreaField label="TLR(s)" name="tlrs" value={form.tlrs} onChange={handleChange} rows={2} />
              <Field label="Reference / Ref." name="ref" value={form.ref} onChange={handleChange} />
            </div>
          </section>

          {/* Section: Lesson Phases */}
          <section>
            <h3 className="text-xs font-bold text-irm-primary uppercase tracking-wider mb-3 pb-1 border-b border-irm-border">
              Lesson Phases
            </h3>
            <div className="space-y-3">
              <TextAreaField
                label="Phase 1 – Starter (Preparing the brain for learning)"
                name="phase1"
                value={form.phase1}
                onChange={handleChange}
                rows={4}
                required
              />
              <TextAreaField
                label="Phase 2 – Main (New learning including assessment)"
                name="phase2"
                value={form.phase2}
                onChange={handleChange}
                rows={6}
                required
              />
              <TextAreaField
                label="Phase 3 – Plenary / Reflections"
                name="phase3"
                value={form.phase3}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>
          </section>

          {/* Section: Other Info */}
          <section>
            <h3 className="text-xs font-bold text-irm-primary uppercase tracking-wider mb-3 pb-1 border-b border-irm-border">
              Other Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Vetted By" name="vettedBy" value={form.vettedBy} onChange={handleChange} />
              <Field label="Tags (comma-separated)" name="tags" value={form.tags} onChange={handleChange} placeholder="e.g. Math, Week 1" />
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-irm-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-irm-border text-irm-text-secondary hover:bg-irm-bg-hover text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-irm-primary text-white text-sm font-semibold hover:bg-irm-primary-hover transition-colors"
            >
              {initial?.id ? "Update Note" : "Save Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
