interface DateInputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const DateInput: React.FC<DateInputProps> = ({ onChange }) => (
  <input
    type="date"
    onChange={onChange}
    className="flex-1 p-2.5 rounded-lg bg-white border-neutral-200 border focus:outline-none"
  />
);

export default DateInput;
