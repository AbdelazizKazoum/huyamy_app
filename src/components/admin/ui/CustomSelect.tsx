"use client";

import { Fragment, ReactNode, Children, isValidElement } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronsUpDown } from "lucide-react";

interface OptionElement {
  props: {
    value: string;
    children: ReactNode;
    disabled?: boolean;
  };
}

interface CustomSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  error?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  value,
  onChange,
  children,
  error,
}) => {
  const options = (
    Children.map(children, (child) => {
      if (isValidElement(child) && child.type === "option") {
        return child as OptionElement;
      }
      return null;
    }) ?? []
  ).filter((x): x is OptionElement => x !== null);

  const selectedOption =
    options.find((opt) => opt.props.value === value) || options[0];

  return (
    <div>
      <Listbox value={value} onChange={onChange}>
        <Listbox.Label className="block text-sm font-medium text-gray-700">
          {label}
        </Listbox.Label>
        <div className="relative mt-1">
          <Listbox.Button
            className={`relative w-full cursor-default rounded-md border bg-white py-2.5 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-green-600 focus:ring-green-600"
            }`}
          >
            <span className="block truncate">
              {selectedOption?.props.children}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronsUpDown
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-2 text-base shadow-lg border border-gray-200 focus:outline-none sm:text-sm">
              {options.map((option, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-green-50 text-green-800" : "text-gray-900"
                    } ${
                      option.props.disabled
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`
                  }
                  value={option.props.value}
                  disabled={option.props.disabled}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected
                            ? "font-semibold text-green-700"
                            : "font-normal"
                        }`}
                      >
                        {option.props.children}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600">
                          <Check className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default CustomSelect;
