"use client";
import React from "react";

interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
}

export default function FormGroup({ children, className = "" }: FormGroupProps) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}
