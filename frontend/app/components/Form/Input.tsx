"use client";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
}

export default function Input({
  label,
  error,
  helperText,
  required,
  fullWidth = true,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-irm-text-secondary mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-3.5 py-2.5 border rounded-xl text-sm
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-irm-primary/25 focus:border-irm-border-focus
          bg-irm-input-bg text-irm-text border-irm-input-border
          placeholder:text-irm-text-muted
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? "border-irm-danger focus:ring-irm-danger/20" : "hover:border-irm-border-focus/60"}
          ${className}
        `}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-xs text-irm-danger font-medium">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="mt-1 text-xs text-irm-text-muted">
          {helperText}
        </p>
      )}
    </div>
  );
}
