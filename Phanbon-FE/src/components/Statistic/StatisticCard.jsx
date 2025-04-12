import React, { useState } from "react";
import StatisticDetailModal from "./StatisticDetailModal";

const StatisticCard = ({ statistic }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="p-4 hover:bg-gray-50 transition-colors duration-150">
        {/* Desktop layout */}
        <div className="hidden md:grid md:grid-cols-10 md:gap-4 items-center">
          <div className="col-span-1 text-sm text-gray-900">
            {statistic.averageOrderValue}
          </div>
          <div className="col-span-2 text-sm font-medium text-gray-900">
            {statistic.totalOrders}
          </div>
          <div className="col-span-2 text-sm font-medium text-gray-900">
            {statistic.totalPurchases}
          </div>
          <div className="col-span-2 text-sm text-gray-500">
            {statistic.totalRevenue}
          </div>
          <div className="col-span-1 text-sm text-gray-500">
            {statistic.totalSales}
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
            <span className="font-semibold text-gray-700">Mã khách hàng</span>

            <span className="text-gray-900">{statistic.averageOrderValue}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Tên khách hàng</span>
            <span className="text-gray-900 font-medium">
              {statistic.totalOrders}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Email</span>
            <span className="text-gray-500">{statistic.totalPurchases}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Điện thoại</span>
            <span className="text-gray-500">{statistic.totalRevenue}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Tình trạng</span>
            <span className="text-gray-500">{statistic.totalSales}</span>
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
        <StatisticDetailModal
          products={statistic.productReports}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default StatisticCard;
