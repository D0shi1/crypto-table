import React from "react";
import { useSearchParams } from "react-router-dom";

interface PaginationProps {
  offset: number;
  limit: number;
  total: number;
  onPageChange: (offset: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  offset,
  limit,
  total,
  onPageChange,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  if (total <= 0 || limit <= 0) {
    return null;
  }

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  const handlePageChange = (newOffset: number) => {
    const newPage = Math.floor(newOffset / limit) + 1;
    setSearchParams({ page: newPage.toString() });
    onPageChange(newOffset);
  };

  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={() => handlePageChange(offset - limit)}
        disabled={offset === 0}
        className="px-4 py-2 mx-1 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span
        className="px-4 py-2 mx-1 bg-gray-200 rounded-lg text-center font-medium text-gray-800"
        style={{ lineHeight: "2rem" }}
      >
        {currentPage}
      </span>
      <button
        onClick={() => handlePageChange(offset + limit)}
        disabled={offset + limit >= total}
        className="px-4 py-2 mx-1 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;