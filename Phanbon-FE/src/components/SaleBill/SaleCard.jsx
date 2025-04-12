import React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const SaleCard = ({ saleBill, onViewDetails }) => {
  const userName = saleBill.userId?.userName || 'Không có thông tin';
  const userPhone = saleBill.userId?.userPhone || 'Không có số điện thoại';

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'active':
        return 'Hoàn tất';
      case 'inactive':
        return 'Còn nợ';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors duration-150 ease-in-out">
      <div className="md:hidden space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">{saleBill.salesInvoiceId}</span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            saleBill.statusSalesInvoice === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {getStatusDisplay(saleBill.statusSalesInvoice)}
          </span>
        </div>
        <div>
          <p className="font-medium">{userName}</p>
          <p className="text-sm text-gray-500">{userPhone}</p>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-green-600">{parseInt(saleBill.sumBill).toLocaleString()} đ</span>
          <span className="text-sm text-gray-500">{format(new Date(saleBill.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</span>
        </div>
        <button
          onClick={() => onViewDetails(saleBill)}
          className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          Chi tiết
        </button>
      </div>

      <div className="hidden md:grid grid-cols-7 gap-4 items-center">
        <div className="font-medium">{saleBill.salesInvoiceId}</div>
        <div>{userName}</div>
        <div>{userPhone}</div>
        <div className="text-right font-semibold text-green-600">
          {parseInt(saleBill.sumBill).toLocaleString()} đ
        </div>
        <div className="text-center">
          {format(new Date(saleBill.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
        </div>
        <div className="text-center">
          <span className={`px-2 py-1 rounded-full text-xs ${
            saleBill.statusSalesInvoice === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {getStatusDisplay(saleBill.statusSalesInvoice)}
          </span>
        </div>
        <div className="text-center">
          <button
            onClick={() => onViewDetails(saleBill)}
            className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            Chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaleCard;
