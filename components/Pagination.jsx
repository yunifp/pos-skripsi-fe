import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItemsInCurrentPage,
}) => {
  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 bg-[#8BB2B2] hover:bg-[#638B8B] rounded-md disabled:bg-gray-300 transition-colors duration-100"
        disabled={currentPage === 1}
      >
        <FontAwesomeIcon icon={faArrowLeft} className="text-white" />
      </button>

      {/* Nomor Halaman */}
      <span className="px-4 py-2 bg-[#638B8B] rounded-md text-white">
        {currentPage}
      </span>

      {/* Tombol Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 bg-[#8BB2B2] hover:bg-[#638B8B] rounded-md disabled:bg-gray-300 transition-colors duration-100"
        disabled={
          currentPage === totalPages || totalItemsInCurrentPage < itemsPerPage
        }
      >
        <FontAwesomeIcon icon={faArrowRight} className="text-white" />
      </button>
    </div>
  );
};

export default Pagination;
