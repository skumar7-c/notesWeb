import React from "react";
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="flex items-center w-full max-w-md bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition">
      <FaSearch className="text-gray-400 mr-2" onClick={handleSearch} />

      <input
        type="text"
        placeholder="Search notes by title or tag..."
        className="flex-grow bg-transparent text-sm outline-none"
        value={value}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSearch();
        }}
      />

      {value && (
        <IoMdClose
          className="text-gray-400 hover:text-black cursor-pointer text-lg ml-2"
          onClick={onClearSearch}
        />
      )}
    </div>
  );
};

export default SearchBar;
