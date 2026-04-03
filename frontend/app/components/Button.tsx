"use client";
import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "gold";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-snow-accent text-white hover:bg-snow-accent-hover shadow-sm active:bg-snow-accent/90",
  secondary:
    "bg-snow-bg text-snow-text-secondary border border-snow-border hover:bg-snow-border/50 active:bg-snow-border",
  outline:
    "bg-transparent text-snow-accent border border-snow-accent hover:bg-snow-accent-light active:bg-snow-accent/10",
  ghost:
    "bg-transparent text-snow-text-secondary hover:bg-snow-bg active:bg-snow-border/50",
  danger:
    "bg-snow-red text-white hover:bg-snow-red/90 active:bg-snow-red/80 shadow-sm",
  gold:
    "bg-snow-orange text-white font-bold hover:bg-snow-orange/90 active:bg-snow-orange/80 shadow-sm",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2 text-sm rounded-xl gap-2",
  lg: "px-6 py-3 text-base rounded-xl gap-2.5",
};

const iconSize: Record<ButtonSize, string> = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export default function Button({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={`
        inline-flex items-center justify-center font-semibold
        transition-all duration-150 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-snow-accent/30 focus:ring-offset-1
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg
          className={`animate-spin ${iconSize[size]}`}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && icon && iconPosition === "left" && (
        <span className={`flex-shrink-0 ${iconSize[size]}`}>{icon}</span>
      )}
      {children}
      {!loading && icon && iconPosition === "right" && (
        <span className={`flex-shrink-0 ${iconSize[size]}`}>{icon}</span>
      )}
    </button>
  );
}
