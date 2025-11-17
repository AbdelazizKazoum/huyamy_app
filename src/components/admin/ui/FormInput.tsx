/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  UseFormRegister,
  FieldError,
  FieldErrorsImpl,
  Merge,
} from "react-hook-form";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  register?: UseFormRegister<any>;
  name?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  error,
  register,
  name,
  ...props
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        id={id}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-700 focus:border-primary-700 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        {...(register && name ? register(name) : {})}
        {...props}
      />
      {error && typeof error.message === "string" && (
        <p className="text-red-500 text-xs mt-1">{error.message}</p>
      )}
    </div>
  );
};

export default FormInput;
