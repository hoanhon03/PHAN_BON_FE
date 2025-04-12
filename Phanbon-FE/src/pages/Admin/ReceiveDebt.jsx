import React, { useState } from "react";
import useFetchReceiveDebt from "../../hooks/useFetchReceiveDebt";
import ReceiveDebtCard from "../../components/ReceiveDebt/ReceiveDebtCard";

const ReceiveDebt = () => {
  const receiveDebts = useFetchReceiveDebt();
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  if (!receiveDebts)
    return <div className="text-center py-8 text-gray-500">Đang tải...</div>;

  const filteredReceiveDebts = receiveDebts.filter((debt) =>
    debt.ReceivableId.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(receiveDebts);
  return (
    <div className="bg-gray-100 p-2 sm:p-6">
      <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-green-800 mb-2 sm:mb-0">
            DANH SÁCH CÔNG NỢ NHẬN
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
          </div>
        </div>

        <div className=" h-full flex-grow">
          <div className="">
            <div className="bg-white shadow-md rounded-lg mx-4 md:mx-6">
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 font-semibold text-gray-700 sticky top-0">
                <div className="col-span-1">Mã công nợ</div>
                <div className="col-span-3">Mã khách hàng</div>
                <div className="col-span-2">Nợ</div>
                <div className="col-span-2">Đã trả</div>
                <div className="col-span-2">Loại chi</div>
                <div className="col-span-1">Tình trạng</div>
              </div>
              <div className="overflow-auto h-[76vh] divide-y divide-gray-200">
                {filteredReceiveDebts && filteredReceiveDebts.length > 0 ? (
                  filteredReceiveDebts.map((debt) => (
                    <ReceiveDebtCard key={debt._id} receiveDebt={debt} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Không tìm thấy hóa đơn nào
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiveDebt;
