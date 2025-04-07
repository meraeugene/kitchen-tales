import { useState, useEffect } from "react";
import useDebouncedValue from "../../hooks/useDebounce";
import { IoIosSearch } from "react-icons/io";

interface SearchComponentProps {
  onSearch: (value: string) => void;
  className?: string;
  placeholder?: string;
  delay?: number;
}

const SearchComponent = ({
  onSearch,
  className = "",
  placeholder = "Search...",
  delay = 500,
}: SearchComponentProps) => {
  const [inputValue, setInputValue] = useState("");
  const debouncedValue = useDebouncedValue(inputValue, delay);

  // Call onSearch only when debouncedValue changes
  useEffect(() => {
    if (debouncedValue) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch]);

  return (
    <div className="relative h-12 focus-within:shadow-lg">
      <IoIosSearch
        color="#121212"
        size={22}
        className="absolute left-[14px] top-[14px]"
      />

      <input
        type="search"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={`peer h-full w-full pl-12 pr-4 text-gray-700 outline-none  ${className}`}
      />
    </div>
  );
};

export default SearchComponent;
