import React, { useState, useEffect } from "react";
import { useProductStore } from "../store/useProductStore";
import { SearchIcon } from "lucide-react";

function SearchBar() {
  const { filters, setFilters, fetchProducts } = useProductStore();
  const [localSearch, setLocalSearch] = useState(filters.search || "");

  useEffect(() => {
    setLocalSearch(filters.search || "");
  }, [filters.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ search: localSearch });
    fetchProducts(1);
  };

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-xs">
      <div className="join w-full">
        <input
          type="text"
          className="input input-bordered input-sm join-item flex-1"
          placeholder="Search products..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-sm btn-ghost join-item">
          <SearchIcon className="size-4" />
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
