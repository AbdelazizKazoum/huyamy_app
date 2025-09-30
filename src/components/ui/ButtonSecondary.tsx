import React from "react";

interface ButtonSecondaryProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseClasses =
    " font-bold cursor-pointer rounded-full transition-all duration-300 shadow-md bg-white border-2 border-primary-800 text-primary-800 hover:bg-primary-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2";

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

export default ButtonSecondary;
