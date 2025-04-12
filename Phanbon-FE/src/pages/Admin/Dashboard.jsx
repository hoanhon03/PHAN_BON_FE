import React, { useState, useCallback, useMemo } from 'react';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import useFetchDashboard from '../../hooks/useFetchdashboard';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import GradientBorderBox from '../../duong-vien/GradientBorderbox';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

// Hàm để lọc dữ liệu âm
const filterNegativeValues = (data) => {
  return data.map(value => Math.max(0, value));
};

const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  
  const formatDate = (date) => date.toISOString().split('T')[0];
  
  const { data: revenueData, loading, error, refetch } = useFetchDashboard(formatDate(startDate), formatDate(endDate));

  const handleDateChange = useCallback(() => {
    refetch();
  }, [refetch]);

  const filteredReports = useMemo(() => {
    if (!revenueData || !revenueData.reports) return [];
    return revenueData.reports.filter(report => 
      report.totalRevenue !== 0 || 
      report.totalSales !== 0 || 
      report.totalPurchases !== 0 || 
      report.totalOrders !== 0
    );
  }, [revenueData]);

  const totalProfitData = useMemo(() => {
    if (filteredReports.length === 0) return { labels: [], data: [] };
    return {
      labels: filteredReports.map(report => new Date(report.date).toLocaleDateString('vi-VN')),
      data: filteredReports.map(report => report.totalRevenue)
    };
  }, [filteredReports]);

  const pieData = {
    labels: ['Doanh thu', 'Chi phí'],
    datasets: [
      {
        data: revenueData?.summary ? [revenueData.summary.totalSales, revenueData.summary.totalPurchases] : [0, 0],
        backgroundColor: ['#4caf50', '#f44336'],
      },
    ],
  };

  const barData = {
    labels: totalProfitData.labels,
    datasets: [
      {
        label: 'Tổng lợi nhuận',
        data: filterNegativeValues(totalProfitData.data),
        backgroundColor: '#4caf50',
      },
    ],
  };

  const salesData = {
    labels: ['Doanh thu', 'Chi phí'],
    datasets: [
      {
        label: 'Thống kê doanh số',
        data: revenueData?.summary 
          ? filterNegativeValues([
              revenueData.summary.totalSales, 
              revenueData.summary.totalPurchases, 
            ])
          : [0, 0],
        backgroundColor: ['#4caf50', '#f44336'],
      },
    ],
  };

  const profitLineData = {
    labels: totalProfitData.labels,
    datasets: [
      {
        label: 'Tổng lợi nhuận',
        data: filterNegativeValues(totalProfitData.data),
        borderColor: '#4caf50',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 10,
          font: {
            size: 10
          }
        }
      },
      title: {
        display: true,
        text: 'Biểu đồ doanh thu',
        font: {
          size: 14
        }
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 8
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value, index, values) {
            return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
          },
          font: {
            size: 8
          }
        }
      }
    }
  };
  
  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Đã xảy ra lỗi: {error.message}</div>;

  return (
    <div className="bg-white p-2 sm:p-4 max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">DASHBOARD</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center w-full sm:w-auto">
          <div className="mb-2 sm:mb-0 sm:mr-4 w-full sm:w-auto">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="p-2 border border-gray-300 rounded-md w-full sm:w-auto"
              placeholderText="Ngày bắt đầu"
            />
          </div>
          <div className="mb-2 sm:mb-0 sm:mr-4 w-full sm:w-auto">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="p-2 border border-gray-300 rounded-md w-full sm:w-auto"
              placeholderText="Ngày kết thúc"
            />
          </div>
          <button 
            onClick={handleDateChange}
            className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-auto"
          >
            Cập nhật
          </button>
        </div>
      </div>
      
      {loading ? (
        <div>Đang tải...</div>
      ) : error ? (
        <div>Đã xảy ra lỗi: {error.message}</div>
      ) : filteredReports.length === 0 ? (
        <p className="text-center text-gray-500">Không có dữ liệu cho khoảng thời gian này</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <GradientBorderBox>
            <div className="bg-white rounded-lg shadow p-2 sm:p-4">
            
              <h3 className="text-base sm:text-lg font-semibold mb-2">Tổng quan doanh thu và chi phí</h3>
              <div className="h-40 sm:h-48">
                <Pie data={pieData} options={options} />
              </div>
            </div>
            </GradientBorderBox>
            
            <GradientBorderBox className="bg-white rounded-lg shadow p-2 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold mb-2">Thống kê doanh số</h3>
              <div className="h-40 sm:h-48">
                <Bar data={salesData} options={options} />
              </div>
              </GradientBorderBox>
            
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            < GradientBorderBox className="bg-white rounded-lg shadow p-2 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold mb-2">Tổng lợi nhuận theo thời gian</h3>
              <div className="h-32 sm:h-40">
                <Line data={profitLineData} options={options} />
              </div>
            </GradientBorderBox>
            <GradientBorderBox className="bg-white rounded-lg shadow p-2 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold mb-2">Tổng đơn hàng</h3>
              <p className="text-xl sm:text-2xl font-bold text-green-500">{revenueData?.summary?.totalOrders || 0}</p>
            </GradientBorderBox>
            <GradientBorderBox className="bg-white rounded-lg shadow p-2 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold mb-2">Giá trị đơn hàng trung bình</h3>
              <p className="text-xl sm:text-2xl font-bold text-blue-500">
                {revenueData?.summary?.averageOrderValue?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '0 VND'}
              </p>
            </GradientBorderBox>
          </div>
          
          <GradientBorderBox className="bg-white rounded-lg shadow p-2 sm:p-4">
            <h3 className="text-base sm:text-lg font-semibold mb-2">Tổng lợi nhuận theo ngày</h3>
            <div className="h-48 sm:h-64">
              <Bar data={barData} options={options} />
            </div>
          </GradientBorderBox>
        </>
      )}
    </div>
  );
};

export default Dashboard; 