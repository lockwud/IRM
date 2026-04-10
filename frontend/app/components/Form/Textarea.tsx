"use client";
import React from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
  maxChars?: number;
}

export default function Textarea({
  label,
  error,
  helperText,
  required,
  fullWidth = true,
  maxChars,
  className = "",
  id,
  value,
  onChange,
  ...props
}: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const charCount = typeof value === "string" ? value.length : 0;

  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-semibold text-irm-text-secondary mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        value={value}
        onChange={onChange}
        maxLength={maxChars}
        className={`
          w-full px-3.5 py-2.5 border rounded-xl text-sm
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-irm-primary/25 focus:border-irm-border-focus
          bg-irm-input-bg text-irm-text border-irm-input-border
          placeholder:text-irm-text-muted resize-vertical
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? "border-irm-danger focus:ring-irm-danger/20" : "hover:border-irm-border-focus/60"}
          ${className}
        `}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
        {...props}
      />
      <div className="flex items-end justify-between mt-1.5">
        <div className="flex-1">
          {error && (
            <p id={`${textareaId}-error`} className="text-sm text-red-600 font-medium">
              {error}
            </p>
          )}
          {helperText && !error && (
            <p id={`${textareaId}-helper`} className="text-xs text-gray-500">
              {helperText}
            </p>
          )}
        </div>
        {maxChars && (
          <p className="text-xs text-gray-500 ml-2 whitespace-nowrap">
            {charCount} / {maxChars}
          </p>
        )}
      </div>
    </div>
  );
}
