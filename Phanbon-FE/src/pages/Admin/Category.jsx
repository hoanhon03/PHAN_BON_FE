import React, { useState, useCallback } from 'react';
import CategoryCard from "../../components/Category/CategoryCard";
import AddCategoryModal from "../../components/Category/AddCategoryModal";
import useFetchCategories from "../../hooks/useFetchCategories";
import Pagination from "../../components/common/Pagination";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Category = () => {
  const { categories, isLoading, error, updateCategory, fetchCategories } = useFetchCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage, setCategoriesPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleFilterStatus = (event) => {
    setFilterStatus(event.target.value);
    setCurrentPage(1);
  };

  const handleCategoriesPerPageChange = (event) => {
    setCategoriesPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleUpdateCategory = useCallback(async (updatedCategory) => {
    try {
      await updateCategory(updatedCategory);
      await fetchCategories(); // Tải lại danh sách sau khi cập nhật
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);
    }
  }, [updateCategory, fetchCategories]);

  const filteredCategories = categories ? categories.filter(category =>
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === '' || category.status === filterStatus)
  ) : [];

  // Tính toán danh mục cho trang hiện tại
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);

  // Thay đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-8 text-red-500">Đã xảy ra lỗi: {error}</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="p-4 md:p-6 flex-shrink-0 ">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] to-[#45a049] mb-4 md:mb-0">
            DANH SÁCH DANH MỤC
          </h1>
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Tìm kiếm danh mục..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-2 pl-8 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all duration-300 ease-in-out"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <select
              value={filterStatus}
              onChange={handleFilterStatus}
              className="w-full md:w-auto p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all duration-300 ease-in-out"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="show">Hiển thị</option>
              <option value="hidden">Ẩn</option>
            </select>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full md:w-auto bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 ease-in-out font-semibold transform hover:scale-105"
            >
              Thêm danh mục
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Hiển thị</span>
            <select
              value={categoriesPerPage}
              onChange={handleCategoriesPerPageChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-600">danh mục mỗi trang</span>
          </div>
          
          {/* Phân trang cho thiết bị di động */}
          <div className="md:hidden">
            <Pagination
              itemsPerPage={categoriesPerPage}
              totalItems={filteredCategories.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-auto h-full">
        <div className="">
          <div className="bg-white shadow-md rounded-lg mx-4 md:mx-6">
            <div className="hidden md:grid grid-cols-10 gap-4 p-4 bg-gray-50 font-semibold text-gray-700 sticky top-0 z-10">
              <div className="col-span-4">Tên danh mục</div>
              <div className="col-span-2">Trạng thái</div>
              <div className="col-span-3">Ngày tạo</div>
              <div className="col-span-1">Thao tác</div>
            </div>
            <div className="overflow-auto h-[calc(100vh-300px)] divide-y divide-gray-200">
              {currentCategories.length > 0 ? (
                currentCategories.map((category) => (
                  <CategoryCard 
                    key={category._id} 
                    category={category} 
                    onUpdateCategory={handleUpdateCategory}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">Không tìm thấy danh mục nào.</div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Phân trang cho màn hình lớn hơn */}
      <div className="hidden md:block mt-4 mb-6">
        <Pagination
          itemsPerPage={categoriesPerPage}
          totalItems={filteredCategories.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
      
      <AddCategoryModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};

export default Category;
