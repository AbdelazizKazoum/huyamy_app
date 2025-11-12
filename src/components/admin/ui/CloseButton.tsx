"use client";

import React from "react";
import { X } from "lucide-react";

interface CloseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost";
}

const CloseButton: React.FC<CloseButtonProps> = ({
  size = "md",
  variant = "default",
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    default: "text-gray-500 hover:bg-gray-100 focus:ring-gray-500",
    ghost:
      "text-gray-400 hover:text-gray-600 hover:bg-gray-50 focus:ring-gray-500",
  };

  const sizeClasses = {
    sm: "p-1",
    md: "p-2",
    lg: "p-3",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button type="button" className={classes} disabled={disabled} {...props}>
      <X size={iconSizes[size]} />
    </button>
  );
};

export default CloseButton;
