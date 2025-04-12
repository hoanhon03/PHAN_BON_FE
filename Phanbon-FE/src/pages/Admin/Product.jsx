import React, { useState, useEffect } from 'react';
import ProductCard from "../../components/Product/ProductCard";
import AddProductModal from "../../components/Product/AddProductModal";
import useFetchProducts from "../../hooks/useFetchProducts";
import Pagination from "../../components/common/Pagination";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Product = () => {
  const { products, isLoading, error, updateProduct } = useFetchProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleFilterCategory = (event) => {
    setFilterCategory(event.target.value);
    setCurrentPage(1);
  };

  const handleFilterStatus = (event) => {
    setFilterStatus(event.target.value);
    setCurrentPage(1);
  };

  const handleProductsPerPageChange = (event) => {
    setProductsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const filteredProducts = products.filter(product =>
    (product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoryId.categoryName.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterCategory === '' || product.categoryId.categoryName === filterCategory) &&
    (filterStatus === '' || product.status === filterStatus)
  );

  // Lấy danh sách danh mục duy nhất
  const categories = [...new Set(products.map(product => product.categoryId.categoryName))];

  // Tính toán sản phẩm cho trang hiện tại
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Thay đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-8 text-red-500">Đã xảy ra lỗi: {error}</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="p-4 md:p-6 flex-shrink-0">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] to-[#45a049] mb-4 md:mb-0">
            DANH SÁCH SẢN PHẨM
          </h1>
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-2 pl-8 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all duration-300 ease-in-out"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <select
              value={filterCategory}
              onChange={handleFilterCategory}
              className="w-full md:w-auto p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all duration-300 ease-in-out"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
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
              Thêm sản phẩm
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Hiển thị</span>
            <select
              value={productsPerPage}
              onChange={handleProductsPerPageChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-600">sản phẩm mỗi trang</span>
          </div>
          
          {/* Phân trang cho thiết bị di động */}
          <div className="md:hidden">
            <Pagination
              itemsPerPage={productsPerPage}
              totalItems={filteredProducts.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-auto">
        <div className="bg-white shadow-md rounded-lg mx-4 md:mx-6">
          <div className="hidden md:grid grid-cols-8 gap-4 p-4 bg-gray-50 font-semibold text-gray-700 sticky top-0 z-10">
            <div className="col-span-1">Mã SP</div>
            <div className="col-span-2">Tên sản phẩm</div>
            <div className="col-span-1">Danh mục</div>
            <div className="col-span-1">Giá mua</div>
            <div className="col-span-1">Giá bán</div>
            <div className="col-span-1">Trạng thái</div>
            <div className="col-span-1">Thao tác</div>
          </div>
          <div className="divide-y divide-gray-200">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  onUpdate={updateProduct}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">Không tìm thấy sản phẩm nào.</div>
            )}
          </div>
        </div>
      </div>
      
      {/* Phân trang cho màn hình lớn hơn */}
      <div className="hidden md:block mt-4 mb-6">
        <Pagination
          itemsPerPage={productsPerPage}
          totalItems={filteredProducts.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
      
      <AddProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};

export default Product;
