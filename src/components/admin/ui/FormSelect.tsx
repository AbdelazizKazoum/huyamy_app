import { ChevronDown } from "lucide-react";
import React, { SelectHTMLAttributes } from "react";

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  id,
  error,
  children,
  className,
  ...props
}) => {
  const baseClasses =
    "w-full appearance-none rounded-md border bg-transparent py-2 pl-3 pr-10 text-base focus:outline-none";
  const errorClasses =
    "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500";
  const defaultClasses =
    "border-gray-300 text-gray-900 placeholder-gray-400 focus:border-green-600 focus:ring-green-600";

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mt-1">
        <select
          id={id}
          className={`${baseClasses} ${
            error ? errorClasses : defaultClasses
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronDown className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormSelect;
