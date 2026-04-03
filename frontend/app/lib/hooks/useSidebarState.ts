"use client";
import { useState, useCallback } from "react";

interface UseSidebarStateReturn {
  expandedSections: Record<string, boolean>;
  toggleSection: (section: string) => void;
  expandSection: (section: string) => void;
  collapseSection: (section: string) => void;
}

export function useSidebarState(): UseSidebarStateReturn {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "Internship Management": true,
    "Academic Records": false,
    "IRMS": false,
    "Support": false,
  });

  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const expandSection = useCallback((section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: true,
    }));
  }, []);

  const collapseSection = useCallback((section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: false,
    }));
  }, []);

  return {
    expandedSections,
    toggleSection,
    expandSection,
    collapseSection,
  };
}
