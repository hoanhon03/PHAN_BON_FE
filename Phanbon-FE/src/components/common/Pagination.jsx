import React, { useState, useEffect } from 'react';

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderPageNumbers = () => {
    const siblingsCount = windowWidth < 640 ? 1 : 2;
    let startPage = Math.max(currentPage - siblingsCount, 1);
    let endPage = Math.min(currentPage + siblingsCount, totalPages);

    const pages = [];

    if (startPage > 1) {
      pages.push(
        <button key={1} onClick={() => paginate(1)} className="px-3 py-2 rounded-md text-sm md:text-base">
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="px-2 py-2">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`px-3 py-2 rounded-md text-sm md:text-base ${
            currentPage === i
              ? 'bg-green-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className="px-2 py-2">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => paginate(totalPages)}
          className="px-3 py-2 rounded-md text-sm md:text-base"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <nav className="flex justify-center mt-4">
      <ul className="flex flex-wrap justify-center items-center space-x-1 md:space-x-2">
        <li>
          <button
            onClick={() => paginate(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 text-sm md:text-base"
          >
            &laquo;
          </button>
        </li>
        {renderPageNumbers()}
        <li>
          <button
            onClick={() => paginate(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 text-sm md:text-base"
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
