import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null; // Don't show pagination if there's only one page

  return (
    <div className="flex justify-between items-center mt-4">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`px-4 py-2 mx-1 ${
          currentPage === 1 ? "bg-gray-400" : "bg-buttonColorPrimary"
        } text-white rounded`}>
        Previous
      </button>

      {/* Page Numbers */}
      {/* {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          className={`px-4 py-2 mx-1 ${
            currentPage === index + 1 ? "bg-buttonColorPrimary" : "bg-blue-300"
          } text-white rounded`}>
          {index + 1}
        </button>
      ))} */}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`px-4 py-2 mx-1 ${
          currentPage === totalPages ? "bg-gray-400" : "bg-buttonColorPrimary"
        } text-white rounded`}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
