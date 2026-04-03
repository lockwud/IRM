"use client";
import React, { useState, useRef, useEffect } from "react";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
  options: SelectOption[];
  onChange?: (value: string | number) => void;
  searchable?: boolean;
}

export default function Select({
  label,
  error,
  helperText,
  required,
  fullWidth = true,
  options,
  onChange,
  searchable = false,
  value,
  className = "",
  id,
  ...props
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string | number) => {
    onChange?.(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Desktop Select */}
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`
          hidden md:block w-full px-4 py-2.5 border rounded-lg text-sm font-medium
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-aamusted-gold focus:ring-offset-1
          bg-white text-gray-900
          disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
          ${error ? "border-red-500 focus:ring-red-200" : "border-gray-300 hover:border-gray-400"}
          ${className}
        `}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
        {...props}
      >
        <option value="">Select {label?.toLowerCase() || "an option"}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Mobile Dropdown */}
      <div className="md:hidden relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full px-4 py-2.5 border rounded-lg text-sm font-medium text-left
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-aamusted-gold focus:ring-offset-1
            bg-white text-gray-900 flex items-center justify-between
            disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
            ${error ? "border-red-500 focus:ring-red-200" : "border-gray-300 hover:border-gray-400"}
            ${className}
          `}
        >
          <span>{selectedOption?.label || `Select ${label?.toLowerCase() || "an option"}`}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
            {searchable && (
              <div className="sticky top-0 p-2 border-b border-gray-200 bg-white">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-aamusted-gold"
                />
              </div>
            )}
            {filteredOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-aamusted-gold/10 ${
                  value === opt.value ? "bg-aamusted-gold/20 text-aamusted-blue" : "text-gray-900"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p id={`${selectId}-error`} className="mt-1 text-sm text-red-600 font-medium">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${selectId}-helper`} className="mt-1 text-xs text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
