import React, { useState, useEffect } from "react";
import axios from "axios";
import useFetchPurchaseBill from "../../hooks/useFetchPurchaseBill";
import PurchaseBillCard from "../../components/PurchaseBill/PurchaseBillCard";
import PurchaseBillDetailModal from "../../components/PurchaseBill/PurchaseDetailModal";
import Pagination from "../../components/common/Pagination";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaPlus, FaSearch, FaFilter } from "react-icons/fa";
import AddPurchaseBillModal from "../../components/PurchaseBill/AddPurchaseBillModal";

const PurchaseBill = () => {
  const [purchaseBills, setPurchaseBills] = useState([]);
  const fetchedPurchaseBills = useFetchPurchaseBill();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPurchaseBillId, setSelectedPurchaseBillId] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddModal, setAddModal] = useState(false);

  useEffect(() => {
    if (fetchedPurchaseBills) {
      setPurchaseBills(fetchedPurchaseBills);
    }
  }, [fetchedPurchaseBills]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleViewDetails = (id) => {
    setSelectedPurchaseBillId(id);
  };
  const updatePurchaseBill = (updatedBill) => {
    setPurchaseBills((prevBills) =>
      prevBills.map((bill) =>
        bill._id === updatedBill._id ? updatedBill : bill
      )
    );
  };

  const handleCloseModal = () => {
    setSelectedPurchaseBillId(null);
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (end) {
      setIsCalendarOpen(false);
    }
  };

  const handleAddPurchaseBill = () => {
    setAddModal(true);
  };

  if (!purchaseBills) return <LoadingSpinner />;

  const filteredPurchaseBills = purchaseBills
    .filter((bill) => {
      const invoiceMatch = bill.purchaseInvoiceId
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const dateMatch =
        (!startDate || new Date(bill.createdAt) >= startDate) &&
        (!endDate || new Date(bill.createdAt) <= endDate);
      return invoiceMatch && dateMatch;
    })
    .filter(
      (bill) =>
        (statusFilter === "all" || bill.status === statusFilter) &&
        (approvalFilter === "all" || bill.approveStatus === approvalFilter)
    );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPurchaseBills.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="p-4 md:p-6 flex-shrink-0">
        <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] to-[#45a049] mb-4 text-center md:text-left">
          DANH SÁCH HÓA ĐƠN MUA
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <div className="flex w-full md:w-auto space-x-2">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Tìm theo mã hóa đơn..."
                className="w-full p-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="p-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4CAF50] hover:bg-gray-100"
            >
              <FaFilter className="text-gray-600" />
            </button>
          </div>
          <button
            onClick={handleAddPurchaseBill}
            className="w-full md:w-auto px-4 py-2 bg-[#4CAF50] text-white rounded-full flex items-center justify-center space-x-2 hover:bg-[#45a049] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:ring-opacity-50"
          >
            <FaPlus />
            <span>Thêm hóa đơn</span>
          </button>
        </div>

        {isFilterOpen && (
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mb-4">
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              monthsShown={1}
              showPopperArrow={false}
              placeholderText="Chọn khoảng thời gian"
              className="w-full md:w-auto p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              onCalendarOpen={() => setIsCalendarOpen(true)}
              onCalendarClose={() => setIsCalendarOpen(false)}
              popperClassName="react-datepicker-popper"
              popperModifiers={[
                {
                  name: "offset",
                  options: {
                    offset: [0, 8],
                  },
                },
                {
                  name: "preventOverflow",
                  options: {
                    rootBoundary: "viewport",
                    tether: false,
                    altAxis: true,
                  },
                },
              ]}
              popperPlacement="bottom-start"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-auto p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái thanh toán</option>
              <option value="payed">Hoàn tất</option>
              <option value="prepay">Còn nợ</option>
            </select>
            <select
              value={approvalFilter}
              onChange={(e) => setApprovalFilter(e.target.value)}
              className="w-full md:w-auto p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái phê duyệt</option>
              <option value="approved">Đã phê duyệt</option>
              <option value="pending">Chờ phê duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2 sm:mb-0 w-full sm:w-auto">
            <span className="text-sm text-gray-600">Hiển thị</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
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
            Hiển thị {indexOfFirstItem + 1} -{" "}
            {Math.min(indexOfLastItem, filteredPurchaseBills.length)} trên tổng
            số {filteredPurchaseBills.length} hóa đơn
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-auto px-4 md:px-6">
        <div className="bg-white shadow-md rounded-lg">
          <div className="hidden md:grid grid-cols-8 gap-4 p-4 bg-gray-50 font-semibold text-gray-700 sticky top-0 z-10">
            <div className="truncate">Mã HĐ</div>
            <div className="truncate">Nhà cung cấp</div>
            <div className="truncate">Số điện thoại</div>
            <div className="text-right truncate">Tổng tiền</div>
            <div className="text-center truncate">Ngày tạo</div>
            <div className="text-center truncate">Trạng thái</div>
            <div className="text-center truncate">Phê duyệt</div>
            <div className="text-center truncate">Thao tác</div>
          </div>
          <div className="divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((bill) => (
                <PurchaseBillCard
                  key={bill._id}
                  purchaseBill={bill}
                  onViewDetails={handleViewDetails}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Không tìm thấy hóa đơn nào.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 mb-6 px-4">
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={filteredPurchaseBills.length}
          paginate={setCurrentPage}
          currentPage={currentPage}
        />
      </div>

      {selectedPurchaseBillId && (
        <PurchaseBillDetailModal
          purchaseInvoiceId={selectedPurchaseBillId}
          onClose={handleCloseModal}
          onUpdate={updatePurchaseBill}
        />
      )}
      {isAddModal && (
        <AddPurchaseBillModal
          isOpen={isAddModal}
          closeModal={() => setAddModal(false)}
        />
      )}
    </div>
  );
};

export default PurchaseBill;
