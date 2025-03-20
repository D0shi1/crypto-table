import React from "react";

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  isEmptyResults: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  search,
  onSearchChange,
  isEmptyResults,
}) => {
  return (
    <div className="relative mb-6">
      <input
        type="text"
        placeholder="Search by name or symbol..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-60 z-10 p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      />
      <svg
        className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
};

export default SearchBar;
