import React, { useState, useCallback } from 'react';
import SupplierCard from '../../components/Supplier/SupplierCard';
import AddSupplierModal from '../../components/Supplier/AddSupplierModal';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useFetchSupplier from '../../hooks/useFetchSupplier';
import GradientBorderBox from '../../duong-vien/GradientBorderbox';
import SaleBillDetailModal from '../../components/SaleBill/SaleBillDetailModal';
import axios from 'axios';

const Supplier = () => {
  const { suppliers, isLoading, error, fetchSuppliers, addSupplier, updateSupplier, deleteSupplier } = useFetchSupplier();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [suppliersPerPage, setSuppliersPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState('');



  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleFilterStatus = (event) => {
    setFilterStatus(event.target.value);
    setCurrentPage(1);
  };

  const handleSuppliersPerPageChange = (event) => {
    setSuppliersPerPage(Number(event.target.value));
    setCurrentPage(1);
  };
  const handleAddSupplier = async (newSupplier) => {
    try {
      await addSupplier(newSupplier);
      setIsAddModalOpen(false);
      await fetchSuppliers(); // Gọi fetchSuppliers để cập nhật danh sách
    } catch (error) {
      console.error("Lỗi khi thêm nhà cung cấp:", error);
      // Hiển thị thông báo lỗi cho người dùng
    }
  };

  const handleUpdateSupplier = async (updatedSupplier) => {
    try {
      console.log('Updating supplier in parent:', updatedSupplier);
      if (!updatedSupplier._id) {
        throw new Error('Supplier ID không tồn tại');
      }
      await updateSupplier(updatedSupplier);
      await fetchSuppliers();
    } catch (error) {
      console.error("Lỗi chi tiết khi cập nhật nhà cung cấp:", error.response?.data || error.message);
      // Hiển thị thông báo lỗi cho người dùng
    }
  };
  
  const handleDeleteSupplier = async (supplierId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhà cung cấp này?")) {
      try {
        await deleteSupplier(supplierId);
        // Có thể thêm thông báo thành công ở đây
      } catch (error) {
        console.error("Lỗi khi xóa nhà cung cấp:", error);
        // Hiển thị thông báo lỗi cho người dùng
      }
    }
  };

  const updatedSupplier = useCallback(async (updatedSupplier) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.put(`${import.meta.env.VITE_LOCAL_API_URL}/supplier/${updatedSupplier._id}`, updatedSupplier, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      await fetchSuppliers();
    } catch (error) {
      console.error("Lỗi khi cập nhật nhà cung cấp:", error);
    }
  }, [fetchSuppliers]);

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === '' || supplier.status === filterStatus)
  );

  const indexOfLastSupplier = currentPage * suppliersPerPage;
  const indexOfFirstSupplier = indexOfLastSupplier - suppliersPerPage;
  const currentSuppliers = filteredSuppliers.slice(indexOfFirstSupplier, indexOfLastSupplier);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-8 text-red-500">Đã xảy ra lỗi: {error}</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="p-4 md:p-6 flex-shrink-0">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] to-[#45a049] mb-4 md:mb-0">
            DANH SÁCH NHÀ CUNG CẤP
          </h1>
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
            <div className="relative w-full md:w-64 mb-2 md:mb-0">
              <input
                type="text"
                placeholder="Tìm kiếm nhà cung cấp..."
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
              className="w-full md:w-auto p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all duration-300 ease-in-out mb-2 md:mb-0"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full md:w-auto bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 ease-in-out font-semibold transform hover:scale-105"
            >
              Thêm nhà cung cấp
            </button>
          </div>
        </div>
  
        <div className="flex flex-col md:flex-row justify-between items-center mt-4">
          <div className="flex items-center space-x-2 mb-2 md:mb-0">
            <span className="text-sm text-gray-600">Hiển thị</span>
            <select
              value={suppliersPerPage}
              onChange={handleSuppliersPerPageChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-600">nhà cung cấp mỗi trang</span>
          </div>
        </div>
      </div>
  
      <div className="flex-grow overflow-auto px-4 md:px-6">
        <GradientBorderBox className="bg-white shadow-md rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-gray-50 font-semibold text-gray-700 sticky top-0 z-10">
            <div className="hidden md:block col-span-1 text-center">Mã NHÀ CUNG CẤP</div>
            <div className="col-span-2 text-center">TÊN NHÀ CUNG CẤP</div>
            <div className="hidden md:block col-span-1 text-center">SỐ ĐIỆN THOẠI</div>
            <div className="hidden md:block col-span-1 text-center">Email</div>
            <div className="col-span-1 text-center">THAO TÁC</div>
          </div>
          <div className="divide-y divide-gray-200">
            {currentSuppliers.length > 0 ? (
              currentSuppliers.map((supplier) => (
                <SupplierCard
                  key={supplier._id}
                  supplier={supplier}
                  onUpdate={handleUpdateSupplier}
                  onDelete={handleDeleteSupplier}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">Không tìm thấy nhà cung cấp nào.</div>
            )}
          </div>
        </GradientBorderBox >
      </div>
  
      <div className="mt-4 mb-6 px-4 md:px-6">
        <Pagination
          itemsPerPage={suppliersPerPage}
          totalItems={filteredSuppliers.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
  
      <AddSupplierModal 
       isOpen={isAddModalOpen}
       onClose={() => setIsAddModalOpen(false)} 
       onAddSupplier={handleAddSupplier} />
    </div>
  );
};

export default Supplier;