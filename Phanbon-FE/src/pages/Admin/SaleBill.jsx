import React, { useState } from "react";
import SaleCard from "../../components/SaleBill/SaleCard";
import SaleBillDetailModal from "../../components/SaleBill/SaleBillDetailModal";
import AddSaleBillModal from "../../components/SaleBill/AddSaleBillModal";
import useFetchSaleBills from "../../hooks/useFetchSaleBills";
import Pagination from "../../components/common/Pagination";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import DatePicker, { registerLocale } from "react-datepicker";
import vi from 'date-fns/locale/vi';
import "react-datepicker/dist/react-datepicker.css";

registerLocale('vi', vi);

const SaleBill = () => {
  const { saleBills, isLoading, error, updateSaleBill, addSaleBill, fetchSaleBills } = useFetchSaleBills();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSaleBill, setSelectedSaleBill] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleViewDetails = (saleBill) => {
    setSelectedSaleBill(saleBill);
  };

  const handleCloseModal = () => {
    setSelectedSaleBill(null);
  };

  const handleUpdateSaleBill = (updatedSaleBill) => {
    updateSaleBill(updatedSaleBill);
    setSelectedSaleBill(null);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const filteredSaleBills = saleBills?.filter((bill) => {
    const matchesSearch = bill.salesInvoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bill.userId?.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bill.userId?.userPhone || '').includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || bill.statusSalesInvoice === statusFilter;

    const billDate = new Date(bill.createdAt);
    const matchesDateRange = (!startDate || billDate >= startDate) && (!endDate || billDate <= endDate);

    return matchesSearch && matchesStatus && matchesDateRange;
  }) || [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSaleBills.slice(indexOfFirstItem, indexOfLastItem);

  const handleAddSaleBill = async (newSaleBill) => {
    await addSaleBill(newSaleBill);
    setIsAddModalOpen(false);
  };

  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <button
      className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent text-left"
      onClick={onClick}
      ref={ref}
    >
      {value || "Chọn khoảng thời gian"}
    </button>
  ));

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-8 text-red-500">Đã xảy ra lỗi: {error}</div>;
  if (!saleBills) return <div className="text-center py-8 text-gray-500">Không có dữ liệu</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="p-4 md:p-6 flex-shrink-0">
        <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] to-[#45a049] w-full text-center md:text-left mb-4">
          DANH SÁCH HÓA ĐƠN BÁN
        </h1>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Tìm kiếm..."
                className="w-full p-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent bg-white shadow-sm"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <button
              onClick={toggleFilter}
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              Lọc
            </button>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-300 flex items-center justify-center shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Thêm hóa đơn
          </button>
        </div>
        
        {isFilterOpen && (
          <div className="bg-white p-4 w-full md:w-1/2 md:ml-auto rounded-lg shadow-md mb-6 transition-all duration-300 ease-in-out">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Hoàn tất</option>
                  <option value="inactive">Còn nợ</option>
                </select>
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  setDateRange(update);
                }}
                isClearable={true}
                locale="vi"
                dateFormat="dd/MM/yyyy"
                placeholderText="Chọn khoảng thời gian"
                customInput={<CustomInput />}
                className="w-full"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2 sm:mb-0 w-full sm:w-auto">
            <span className="text-sm text-gray-600">Hiển thị</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-600">hóa đơn mỗi trang</span>
          </div>
          <div className="text-sm text-gray-600 text-center sm:text-right w-full sm:w-auto mt-2 sm:mt-0">
            Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredSaleBills.length)} trên tổng số {filteredSaleBills.length} hóa đơn
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-auto px-4 md:px-6">
        <div className="bg-white shadow-md rounded-lg">
          <div className="hidden md:grid grid-cols-7 gap-4 p-4 bg-gray-50 font-semibold text-gray-700 sticky top-0 z-10">
            <div>Mã HĐ</div>
            <div>Khách hàng</div>
            <div>Số điện thoại</div>
            <div className="text-right">Tổng tiền</div>
            <div className="text-center">Ngày tạo</div>
            <div className="text-center">Trạng thái</div>
            <div className="text-center">Thao tác</div>
          </div>
          <div className="divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((bill) => (
                <SaleCard key={bill._id} saleBill={bill} onViewDetails={setSelectedSaleBill} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">Không tìm thấy hóa đơn nào.</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 mb-6 px-4">
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={filteredSaleBills.length}
          paginate={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
      
      {selectedSaleBill && (
        <SaleBillDetailModal
          saleBill={selectedSaleBill}
          onClose={() => setSelectedSaleBill(null)}
          onUpdate={updateSaleBill}
        />
      )}

      {isAddModalOpen && (
        <AddSaleBillModal
          isOpen={isAddModalOpen}
          closeModal={() => setIsAddModalOpen(false)}
          onAddSaleBill={handleAddSaleBill}
        />
      )}
    </div>
  );
};

export default SaleBill;