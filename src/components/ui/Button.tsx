import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
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
    "font-semibold cursor-pointer rounded-xl transition-all duration-300 inline-flex items-center justify-center";

  const variantClasses = {
    primary:
      "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg",
    secondary:
      "bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg",
    outline:
      "bg-transparent text-green-600 border-2 border-green-600 hover:bg-green-600 hover:text-white shadow-sm hover:shadow-md",
    ghost:
      "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-800 shadow-sm hover:shadow-md",
  };

  const sizeClasses = {
    sm: "py-2 px-4 text-sm",
    md: "py-3 px-6 text-base",
    lg: "py-4 px-8 text-lg",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
