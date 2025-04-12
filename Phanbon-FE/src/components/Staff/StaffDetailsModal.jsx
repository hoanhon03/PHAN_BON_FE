import React from "react";

const StaffDetailsModal = ({ staffDetail, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 ease-in-out">
        <div className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">Chi tiết hóa đơn</h2>
          <div className="bg-white">
            <div>{staffDetail.userName}</div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors duration-200"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDetailsModal;
