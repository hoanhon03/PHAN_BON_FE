import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import axios from "axios";

const PurchaseBillCard = ({ purchaseBill, onViewDetails }) => {
  console.log(purchaseBill);
  const getStatusDisplay = (status) => {
    switch (status) {
      case "payed":
        return "Hoàn tất";
      case "prepay":
        return "Còn nợ";
      default:
        return "Không xác định";
    }
  };

  const getApproveStatusDisplay = (approveStatus) => {
    switch (approveStatus) {
      case "approved":
        return "Đã phê duyệt";
      case "rejected":
        return "Đã từ chối";
      case "pending":
        return "Chờ phê duyệt";
      default:
        return "Chờ phê duyệt";
    }
  };

  const handleViewDetails = () => {
    console.log(
      "Dữ liệu gửi tới API khi xem chi tiết:",
      purchaseBill.purchaseInvoiceId
    );
    onViewDetails(purchaseBill.purchaseInvoiceId);
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors duration-150 ease-in-out">
      <div className="md:hidden space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">{purchaseBill.purchaseInvoiceId}</span>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              purchaseBill.status === "payed"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {getStatusDisplay(purchaseBill.status)}
          </span>
        </div>
        <div>
          <p className="font-medium">{purchaseBill.supplierId.supplierName}</p>
        </div>
        <div>
          <p className="font-medium">{"04012123123"}</p>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-semibold text-green-600">
            {purchaseBill.totalAmount.toLocaleString()} đ
          </span>
          <span className="text-sm text-gray-500">
            {format(new Date(purchaseBill.createdAt), "dd/MM/yyyy HH:mm", {
              locale: vi,
            })}
          </span>
        </div>
        <div className="text-sm">
          <span className="font-medium">Phê duyệt: </span>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              purchaseBill.approveStatus === "approved"
                ? "bg-green-100 text-green-800"
                : purchaseBill.approveStatus === "rejected"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {getApproveStatusDisplay(purchaseBill.approveStatus)}
          </span>
        </div>
        <button
          onClick={handleViewDetails}
          className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          Chi tiết
        </button>
      </div>

      <div className="hidden md:grid grid-cols-8 gap-4 items-center">
        <div className="truncate">{purchaseBill.purchaseInvoiceId}</div>
        <div className="truncate">{purchaseBill.supplierId.supplierName}</div>
        <div className="truncate">{"006565656565"}</div>

        <div className="text-right font-semibold text-green-600 truncate">
          {purchaseBill.totalAmount.toLocaleString()} đ
        </div>
        <div className="text-center truncate">
          {format(new Date(purchaseBill.createdAt), "dd/MM/yyyy HH:mm", {
            locale: vi,
          })}
        </div>
        <div className="text-center">
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs ${
              purchaseBill.status === "payed"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {getStatusDisplay(purchaseBill.status)}
          </span>
        </div>
        <div className="text-center">
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs ${
              purchaseBill.approveStatus === "approved"
                ? "bg-green-100 text-green-800"
                : purchaseBill.approveStatus === "rejected"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {getApproveStatusDisplay(purchaseBill.approveStatus)}
          </span>
        </div>
        <div className="text-center">
          <button
            onClick={handleViewDetails}
            className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            Chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseBillCard;
