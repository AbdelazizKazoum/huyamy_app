import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseClasses =
    "font-bold rounded-full transition-all duration-300 shadow-md";

  const variantClasses = {
    primary: "bg-primary-800 text-white hover:bg-primary-900",
    secondary: "bg-secondary-500 text-white hover:bg-secondary-600",
    outline:
      "bg-transparent text-primary-800 border-2 border-primary-800 hover:bg-primary-800 hover:text-white",
  };

  const sizeClasses = {
    sm: "py-2 px-6 text-sm",
    md: "py-3 px-10 text-base",
    lg: "py-4 px-12 text-lg",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
