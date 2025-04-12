import React, { useState } from "react";
import useFetchCustomers from "../../hooks/useFetchCustomers";
import CustomerCard from "../../components/Customer/CustomerCard";
import AddCustomerModal from "../../components/Customer/AddCustomerModal";

const Customer = () => {
  const customers = useFetchCustomers();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  if (!customers)
    return <div className="text-center py-8 text-gray-500">Đang tải...</div>;

  const filterCustomers = customers.filter((customer) =>
    customer.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
      <div className="bg-gray-100 p-2 sm:p-6">
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-green-800 mb-2 sm:mb-0">
              DANH SÁCH KHÁCH HÀNG
            </h1>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="DH01"
                className="border border-green-500 rounded-md p-2 w-full sm:w-48"
              />
              <select className="border border-green-500 rounded-md p-2 w-full sm:w-auto">
                <option>Lọc</option>
              </select>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="w-full md:w-auto bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 ease-in-out font-semibold transform hover:scale-105"
              >
                Thêm khách hảng
              </button>
            </div>
          </div>

          <div className=" h-full flex-grow">
            <div className="">
              <div className="bg-white shadow-md rounded-lg mx-4 md:mx-6">
                <div className="hidden md:grid grid-cols-11 gap-4 p-4 bg-gray-50 font-semibold text-gray-700 sticky top-0">
                  <div className="col-span-1">Mã khách hàng</div>
                  <div className="col-span-2">Tên khách hàng</div>
                  <div className="col-span-2">Email</div>
                  <div className="col-span-2">Địa chỉ</div>
                  <div className="col-span-1">Điện thoại</div>
                  <div className="col-span-1">Tình trạng</div>
                  <div className="col-span-2">Thao tác</div>
                </div>
                <div className="overflow-auto h-[76vh] divide-y divide-gray-200">
                  {filterCustomers && filterCustomers.length > 0 ? (
                    filterCustomers.map((customer) => (
                      <CustomerCard key={customer._id} customer={customer} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Không tìm thấy nhân viên nào
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {isAddModalOpen && (
          <AddCustomerModal onClose={() => setIsAddModalOpen(false)} />
        )}
      </div>
    </>
  );
};

export default Customer;
