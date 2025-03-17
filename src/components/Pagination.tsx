import React from "react";

interface PaginationProps {
  offset: number;
  limit: number;
  total: number;
  onPageChange: (offset: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ offset, limit, total, onPageChange }) => {
  if (total <= 0 || limit <= 0) {
    return null; 
  }

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={() => onPageChange(offset - limit)}
        disabled={offset === 0}
        className="px-4 py-2 mx-1 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i * limit)}
          className={`px-4 py-2 mx-1 ${
            currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
          } rounded-lg hover:bg-blue-600 hover:text-white transition-colors`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(offset + limit)}
        disabled={offset + limit >= total}
        className="px-4 py-2 mx-1 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;