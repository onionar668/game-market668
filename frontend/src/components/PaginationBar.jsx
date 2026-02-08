import React from "react";
import { useProductStore } from "../store/useProductStore";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

function PaginationBar() {
  const { pagination, fetchProducts } = useProductStore();
  const { page, totalPages } = pagination;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        className="btn btn-sm btn-ghost"
        disabled={page <= 1}
        onClick={() => fetchProducts(page - 1)}
      >
        <ChevronLeftIcon className="size-5" />
      </button>
      <span className="text-sm">
        Page {page} of {totalPages}
      </span>
      <button
        className="btn btn-sm btn-ghost"
        disabled={page >= totalPages}
        onClick={() => fetchProducts(page + 1)}
      >
        <ChevronRightIcon className="size-5" />
      </button>
    </div>
  );
}

export default PaginationBar;
