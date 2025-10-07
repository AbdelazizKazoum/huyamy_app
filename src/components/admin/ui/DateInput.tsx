import { Calendar } from "lucide-react";
import { useRef } from "react";

interface DateInputProps {
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}
const DateInput: React.FC<DateInputProps> = ({
  id,
  value,
  onChange,
  className = "",
}) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    dateInputRef.current?.showPicker();
  };

  return (
    <div className={`relative w-40 ${className}`}>
      <input
        ref={dateInputRef}
        id={id}
        type="date"
        value={value}
        onChange={onChange}
        className="w-full p-2.5 pr-10 rounded-lg bg-white border-neutral-200 border focus:outline-none focus:ring-2 focus:ring-green-500/50 [&::-webkit-calendar-picker-indicator]:hidden"
      />
      <Calendar
        size={20}
        onClick={handleIconClick}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
      />
    </div>
  );
};

export default DateInput;
