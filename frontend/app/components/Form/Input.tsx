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
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-4 py-2.5 border rounded-lg text-sm font-medium
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-aamusted-gold focus:ring-offset-1
          bg-white text-gray-900 placeholder:text-gray-400
          disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
          ${error ? "border-red-500 focus:ring-red-200" : "border-gray-300 hover:border-gray-400"}
          ${className}
        `}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600 font-medium">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="mt-1 text-xs text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
