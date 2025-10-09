import React from "react";

interface CancelButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSubmitting?: boolean;
}

const CancelButton: React.FC<CancelButtonProps> = ({
  isSubmitting,
  children,
  ...props
}) => {
  return (
    <button
      type="button"
      disabled={isSubmitting}
      className="px-6 py-2.5 rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
      {...props}
    >
      {children}
    </button>
  );
};

export default CancelButton;
