import React from "react";
import useFetchDashboard from "../../hooks/useFetchdashboard";
import StatisticCard from "../../components/Statistic/StatisticCard";

const Statistic = () => {
  const formatDate = (date) => date.toISOString().split("T")[0];

  const {
    data: revenueData,
    loading,
    error,
    refetch,
  } = useFetchDashboard(formatDate(new Date()), formatDate(new Date()));
  if (!revenueData) return <div>Loading...</div>;
  return (
    <>
      <div className="bg-gray-100 p-2 sm:p-6">
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-green-800 mb-2 sm:mb-0">
              BÁO CÁO
            </h1>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <button className="w-full md:w-auto bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 ease-in-out font-semibold transform hover:scale-105">
                In
              </button>
            </div>
          </div>

          <div className=" h-full flex-grow">
            <div className="">
              <div className="bg-white shadow-md rounded-lg mx-4 md:mx-6">
                <div className="hidden md:grid grid-cols-10 gap-4 p-4 bg-gray-50 font-semibold text-gray-700 sticky top-0">
                  <div className="col-span-1">Giá trị hóa đơn trung bình</div>
                  <div className="col-span-2">Tổng hóa đơn</div>
                  <div className="col-span-2">Tổng lần mua</div>
                  <div className="col-span-2">Tổng doanh thu</div>
                  <div className="col-span-1">Tổng lượt bán</div>
                  <div className="col-span-2">Thao tác</div>
                </div>
                <div className="overflow-auto h-[76vh] divide-y divide-gray-200">
                  {revenueData.reports.length > 0 &&
                    revenueData.reports.map((item, index) => (
                      <StatisticCard key={index} statistic={item} />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Statistic;
