import React, { useState } from "react";
import StaffDetailsModal from "./StaffDetailsModal";

const StaffCard = ({ staff }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleUpdate = (updatedProduct) => {
    onUpdate(updatedProduct);
    closeModal();
  };
  console.log(staff);
  return (
    <>
      <div className="p-4 hover:bg-gray-50 transition-colors duration-150">
        {/* Desktop layout */}
        <div className="hidden md:grid md:grid-cols-10 md:gap-4 items-center">
          <div className="col-span-1 text-sm text-gray-900">
            {staff.adminId}
          </div>
          <div className="col-span-3 text-sm font-medium text-gray-900">
            {staff.userName}
          </div>
          <div className="col-span-3 text-sm font-medium text-gray-900">
            {staff.nameAdmin}
          </div>
          <div className="col-span-1 text-sm text-gray-500">
            {staff.isBlock ? "Có" : "Không"}
          </div>

          <div className="col-span-2">
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
            <span className="font-semibold text-gray-700">Mã nhân viên:</span>

            <span className="text-gray-900">{staff.adminId}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Username</span>
            <span className="text-gray-900 font-medium">{staff.userName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Tên nhân viên</span>
            <span className="text-gray-500">{staff.nameAdmin}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Chặn</span>
            <span className="text-gray-500">{staff.isBlock}</span>
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
        <StaffDetailsModal
          staffDetail={staff}
          onClose={closeModal}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
};

export default StaffCard;
