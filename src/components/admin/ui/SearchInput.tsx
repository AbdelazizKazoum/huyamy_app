import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}
const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder,
}) => (
  <div className="relative w-full md:w-auto">
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-2.5 pr-10 rounded-lg bg-white border-neutral-200 border focus:outline-none"
    />
    <Search
      size={20}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
    />
  </div>
);

export default SearchInput;
