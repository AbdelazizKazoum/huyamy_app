import { ChevronDown } from "lucide-react";

interface SelectInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}
const SelectInput: React.FC<SelectInputProps> = ({
  value,
  onChange,
  options,
}) => (
  <div className="relative flex-1">
    <select
      value={value}
      onChange={onChange}
      className="appearance-none w-full p-2.5 pr-10 rounded-lg bg-white border-neutral-200 border focus:outline-none min-w-[150px]"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <ChevronDown
      size={16}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
    />
  </div>
);

export default SelectInput;
