import React from "react";

interface ButtonPrimaryProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseClasses =
    "font-bold cursor-pointer rounded-full transition-all duration-300 shadow-md bg-primary-800 text-white hover:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2";

  const sizeClasses = {
    sm: "py-2 px-6 text-sm",
    md: "py-3 px-10 text-base",
    lg: "py-4 px-12 text-lg",
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default ButtonPrimary;
