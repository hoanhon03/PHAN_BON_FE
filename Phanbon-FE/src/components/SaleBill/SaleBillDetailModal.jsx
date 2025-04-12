import React, { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import axios from 'axios';

const SaleBillDetailModal = ({ saleBill, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [statusSalesInvoice, setStatusSalesInvoice] = useState(saleBill.statusSalesInvoice);

  const handleInputChange = (e) => {
    setStatusSalesInvoice(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.put(
        `${import.meta.env.VITE_LOCAL_API_URL}/salesinvoice/${saleBill._id}`,
        { statusSalesInvoice },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      if (response.status === 200) {
        onUpdate({...saleBill, statusSalesInvoice});
        setIsEditing(false);
        alert('Hóa đơn đã được cập nhật thành công!');
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật hóa đơn:", error);
      if (error.response) {
        console.error("Phản hồi từ server:", error.response.data);
      }
      alert("Có lỗi xảy ra khi cập nhật hóa đơn. Vui lòng thử lại.");
    }
  };

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">Chi tiết hóa đơn bán</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Mã hóa đơn</p>
              <p className="text-lg font-semibold">{saleBill.salesInvoiceId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Khách hàng</p>
              <p className="text-lg font-semibold">{saleBill.userId?.userName || 'Không có thông tin'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Số điện thoại</p>
              <p className="text-lg font-semibold">{saleBill.userId?.userPhone || 'Không có số điện thoại'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng tiền</p>
              <p className="text-lg font-semibold text-green-600">{parseInt(saleBill.sumBill).toLocaleString()} đ</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Ngày tạo</p>
              <p className="text-lg font-semibold">
                {format(new Date(saleBill.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Ngày cập nhật</p>
              <p className="text-lg font-semibold">
                {format(new Date(saleBill.updatedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
              </p>
            </div>
            <div className="col-span-2">
              <label className="text-sm text-gray-600">Trạng thái</label>
              {isEditing ? (
                <select
                  name="statusSalesInvoice"
                  value={statusSalesInvoice}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="active">Hoàn tất</option>
                  <option value="inactive">Còn nợ</option>
                </select>
              ) : (
                <p className="text-lg font-semibold">
                  {getStatusDisplay(statusSalesInvoice)}
                </p>
              )}
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Sản phẩm</h3>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Tên sản phẩm</th>
                  <th className="p-2 text-right">Số lượng</th>
                  <th className="p-2 text-right">Đơn giá</th>
                  <th className="p-2 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {saleBill.saleProduct.map((product, index) => {
                  const productName = product.productId?.productName || 'Không có thông tin';
                  const quantity = product.quantityProduct || 0;
                  const price = product.productId?.salePice || 0;
                  const total = quantity * price;

                  return (
                    <tr key={index} className="border-b">
                      <td className="p-2">{productName}</td>
                      <td className="p-2 text-right">{quantity}</td>
                      <td className="p-2 text-right">{price.toLocaleString()} đ</td>
                      <td className="p-2 text-right">{total.toLocaleString()} đ</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors duration-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white rounded-full hover:shadow-lg transition-all duration-300 ease-in-out font-semibold transform hover:scale-105"
                >
                  Lưu
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
                >
                  Chỉnh sửa
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors duration-200"
                >
                  Đóng
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleBillDetailModal;