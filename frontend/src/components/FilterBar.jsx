import React from "react";
import { useProductStore } from "../store/useProductStore";
import { FilterIcon } from "lucide-react";

const CATEGORIES = ["game", "accessory", "collectible", "other"];

function FilterBar() {
  const { filters, setFilters, fetchProducts } = useProductStore();

  const handleApply = () => {
    fetchProducts(1);
  };

  const handleReset = () => {
    setFilters({ search: "", category: "", priceMin: "", priceMax: "" });
    fetchProducts(1);
  };

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-sm gap-2">
        <FilterIcon className="size-4" />
        Filters
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu z-[100] p-4 shadow-lg bg-base-100 rounded-box w-72 mt-2"
      >
        <div className="space-y-3">
          <div>
            <label className="label py-0">Search</label>
            <input
              type="text"
              className="input input-bordered input-sm w-full"
              placeholder="Product name..."
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
            />
          </div>
          <div>
            <label className="label py-0">Category</label>
            <select
              className="select select-bordered select-sm w-full"
              value={filters.category}
              onChange={(e) => setFilters({ category: e.target.value })}
            >
              <option value="">All</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="label py-0">Min $</label>
              <input
                type="number"
                className="input input-bordered input-sm w-full"
                placeholder="0"
                value={filters.priceMin}
                onChange={(e) => setFilters({ priceMin: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <label className="label py-0">Max $</label>
              <input
                type="number"
                className="input input-bordered input-sm w-full"
                placeholder="999"
                value={filters.priceMax}
                onChange={(e) => setFilters({ priceMax: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button className="btn btn-sm btn-ghost flex-1" onClick={handleReset}>
              Reset
            </button>
            <button className="btn btn-sm btn-primary flex-1" onClick={handleApply}>
              Apply
            </button>
          </div>
        </div>
      </ul>
    </div>
  );
}

export default FilterBar;
