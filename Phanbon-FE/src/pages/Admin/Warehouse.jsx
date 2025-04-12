import React, { useState, useEffect } from "react";
import axios from 'axios';
import WarehouseCard from "../../components/Warehouse/WarehouseCard";
import AddWarehouseModal from "../../components/Warehouse/AddWarehouseModal";
import Pagination from "../../components/common/Pagination";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Warehouse = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [warehousesPerPage, setWarehousesPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`${import.meta.env.VITE_LOCAL_API_URL}/warehouse`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log(response.data);
      setWarehouses(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách kho:", error);
      setError("Không thể lấy danh sách kho. Vui lòng thử lại sau.");
      setIsLoading(false);
    }
  };

  const handleAddWarehouse = async (newWarehouse) => {
    try {
      // Lấy thông tin chi tiết của sản phẩm
      const accessToken = localStorage.getItem('accessToken');
      const productResponse = await axios.get(`${import.meta.env.VITE_LOCAL_API_URL}/products/${newWarehouse.productId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      // Kết hợp thông tin kho mới với thông tin sản phẩm
      const warehouseWithProductDetails = {
        ...newWarehouse,
        productId: {
          ...productResponse.data,
          _id: newWarehouse.productId
        }
      };

      setWarehouses(prevWarehouses => [...prevWarehouses, warehouseWithProductDetails]);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      // Nếu không lấy được thông tin sản phẩm, vẫn thêm kho mới nhưng không có thông tin chi tiết sản phẩm
      setWarehouses(prevWarehouses => [...prevWarehouses, newWarehouse]);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleFilterStatus = (event) => {
    setFilterStatus(event.target.value);
    setCurrentPage(1);
  };

  const handleWarehousesPerPageChange = (event) => {
    setWarehousesPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const filteredWarehouses = warehouses.filter(warehouse =>
    (warehouse.wareHouseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.productId.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.productId.productId.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === '' || warehouse.status === filterStatus)
  );

  const indexOfLastWarehouse = currentPage * warehousesPerPage;
  const indexOfFirstWarehouse = indexOfLastWarehouse - warehousesPerPage;
  const currentWarehouses = filteredWarehouses.slice(indexOfFirstWarehouse, indexOfLastWarehouse);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="p-4 md:p-6 flex-shrink-0">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] to-[#45a049] mb-4 md:mb-0">
            DANH SÁCH KHO
          </h1>
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Tìm kiếm kho..."
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
              Thêm kho mới
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Hiển thị</span>
            <select
              value={warehousesPerPage}
              onChange={handleWarehousesPerPageChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-600">kho mỗi trang</span>
          </div>
          
          <div className="md:hidden">
            <Pagination
              itemsPerPage={warehousesPerPage}
              totalItems={filteredWarehouses.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-auto">
        <div className="bg-white shadow-md rounded-lg mx-4 md:mx-6">
          <div className="hidden md:grid grid-cols-5 gap-4 p-4 bg-gray-50 font-semibold text-gray-700 sticky top-0 z-10">
            <div className="col-span-1">Mã SP</div>
            <div className="col-span-1">Tên SP</div>
            <div className="col-span-1">Tên kho</div>
            <div className="col-span-1">SL hiện tại</div>
            <div className="col-span-1">Trạng thái</div>
          </div>
          <div className="divide-y divide-gray-200">
            {currentWarehouses.length > 0 ? (
              currentWarehouses.map((warehouse) => (
                <WarehouseCard 
                  key={warehouse._id} 
                  warehouse={warehouse} 
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">Không tìm thấy kho nào.</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="hidden md:block mt-4 mb-6">
        <Pagination
          itemsPerPage={warehousesPerPage}
          totalItems={filteredWarehouses.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
      
      <AddWarehouseModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAddWarehouse={handleAddWarehouse}
      />
    </div>
  );
};

export default Warehouse;
