import React from "react";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSubmitting: boolean;
  submittingText?: string;
  children: React.ReactNode;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  submittingText = "جاري الحفظ...",
  children,
  ...props
}) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="px-6 py-2.5 rounded-lg text-white bg-primary-700 hover:bg-primary-800 disabled:bg-primary-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[120px]"
      {...props}
    >
      {isSubmitting ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          <span>{submittingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default SubmitButton;
