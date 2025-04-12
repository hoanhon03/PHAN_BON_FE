import React, { useState } from "react";

const ReceiveDebtCard = ({ receiveDebt }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleUpdate = (updatedProduct) => {
    onUpdate(updatedProduct);
    closeModal();
  };
  return (
    <>
      <div className="p-4 hover:bg-gray-50 transition-colors duration-150">
        {/* Desktop layout */}
        <div className="hidden md:grid md:grid-cols-12 md:gap-4 items-center">
          <div className="col-span-1 text-sm text-gray-900">
            {receiveDebt.ReceivableId}
          </div>
          <div className="col-span-3 text-sm font-medium text-gray-900">
            {receiveDebt.userId && receiveDebt.userId.userName}
          </div>
          <div className="col-span-2 text-sm text-gray-500">
            {receiveDebt.debt}
          </div>
          <div className="col-span-2 text-sm text-gray-500">
            {receiveDebt.paid}
          </div>
          <div className="col-span-2 text-sm text-gray-500">
            {receiveDebt.paymentTerm}
          </div>

          <div className="col-span-1">
            <button
              onClick={openModal}
              className="w-full bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white px-3 py-1 rounded-full hover:shadow-lg transition-all duration-300 ease-in-out font-semibold transform hover:scale-105 text-sm"
            >
              Chi tiết
            </button>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="md:hidden space-y-2">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Mã HĐ:</span>

            <span className="text-gray-900">{receiveDebt.ReceivableId}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Mã NCC:</span>
            <span className="text-gray-900 font-medium">
              {receiveDebt.userId && receiveDebt.userId.userName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Tổng tiền</span>
            <span className="text-gray-500">{receiveDebt.deby}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Ngày tạo</span>
            <span className="text-gray-500">{receiveDebt.paid}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Ngày cập nhật </span>
            <span className="text-gray-500">{receiveDebt.paymentTerm}</span>
          </div>

          <div className="mt-2">
            <button
              onClick={openModal}
              className="w-full bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 ease-in-out font-semibold transform hover:scale-105 text-sm"
            >
              Chi tiết
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <ReceiveDebtModal
          debtDetail={purchaseBill.salesInvoiceId}
          onClose={closeModal}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
};

export default ReceiveDebtCard;
