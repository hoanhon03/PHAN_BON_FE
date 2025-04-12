import React, { useState, useEffect } from "react";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import axios from 'axios';

const PurchaseBillDetailModal = ({ purchaseInvoiceId, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [purchaseBill, setPurchaseBill] = useState(null);
  const [editedPurchaseBill, setEditedPurchaseBill] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supplierInfo, setSupplierInfo] = useState({ supplierName: 'Đang tải...', supplierPhone: 'Đang tải...' });

  useEffect(() => {
    const fetchPurchaseBillDetails = async () => {
      try {
        setIsLoading(true);
        const accessToken = window.localStorage.getItem('accessToken');
        const response = await axios.get(`${import.meta.env.VITE_LOCAL_API_URL}/purchase-invoice/${purchaseInvoiceId}/detail`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setPurchaseBill(response.data);
        setEditedPurchaseBill(response.data);
        fetchSupplierInfo(response.data.supplierId);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết hóa đơn:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchaseBillDetails();
  }, [purchaseInvoiceId]);

  const fetchSupplierInfo = async (supplierId) => {
    try {
      const accessToken = window.localStorage.getItem('accessToken');
      const response = await axios.get(`${import.meta.env.VITE_LOCAL_API_URL}/supplier/${supplierId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setSupplierInfo({
        supplierName: response.data.supplierName,
        supplierPhone: response.data.supplierPhone
      });
    } catch (error) {
      console.error('Lỗi khi lấy thông tin nhà cung cấp:', error);
      setSupplierInfo({ supplierName: 'Không có thông tin', supplierPhone: 'Không có số điện thoại' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPurchaseBill(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onUpdate(editedPurchaseBill);
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật hóa đơn:", error);
    }
  };

  const handleApprove = async (status) => {
    try {
      const accessToken = window.localStorage.getItem('accessToken');
      const data = JSON.stringify({
        purchaseInvoiceId: purchaseBill._id,
        approveStatus: status
      });

      console.log('Dữ liệu gửi đi:', data);

      const response = await axios({
        method: 'post',
        url: `${import.meta.env.VITE_LOCAL_API_URL}/approve-purchase-invoice/${purchaseBill._id}`,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        data: data
      });

      console.log('Response từ server:', response);

      if (response.status === 201 && response.data) {
        // Xử lý khi thành công
        const updatedPurchaseBill = { ...purchaseBill, approveStatus: status };
        setPurchaseBill(updatedPurchaseBill);
        setEditedPurchaseBill(updatedPurchaseBill);
        onUpdate(updatedPurchaseBill); // Gọi hàm onUpdate để cập nhật state ở component cha
        alert(`Hóa đơn đã được ${status === 'approved' ? 'phê duyệt' : 'từ chối'} thành công`);
        onClose();
      } else {
        console.error('Response không hợp lệ:', response);
        throw new Error(`Phê duyệt không thành công. Status: ${response.status}, Data: ${JSON.stringify(response.data)}`);
      }
    } catch (error) {
      console.error("Lỗi khi phê duyệt hóa đơn:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      alert(`Lỗi khi phê duyệt hóa đơn: ${error.response?.data?.message || error.message}`);
    }
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!purchaseBill) {
    return <div>Không tìm thấy thông tin hóa đơn</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">Chi tiết hóa đơn mua</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Mã hóa đơn</p>
              <p className="text-lg font-semibold">{purchaseBill.purchaseInvoiceId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Nhà cung cấp</p>
              <p className="text-lg font-semibold">{supplierInfo.supplierName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Số điện thoại</p>
              <p className="text-lg font-semibold">{supplierInfo.supplierPhone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng tiền</p>
              <p className="text-lg font-semibold text-green-600">{purchaseBill.totalAmount?.toLocaleString() ?? 'N/A'} đ</p>
            </div>
            {purchaseBill.status !== 'payed' && (
              <>
                <div>
                  <p className="text-sm text-gray-600">Số tiền đã trả</p>
                  <p className="text-lg font-semibold">{purchaseBill.paidAmount?.toLocaleString() ?? 'N/A'} đ</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số tiền còn nợ</p>
                  <p className="text-lg font-semibold">{purchaseBill.amountOwed?.toLocaleString() ?? 'N/A'} đ</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Thời hạn thanh toán</p>
                  <p className="text-lg font-semibold">{purchaseBill.paymentTems} ngày</p>
                </div>
              </>
            )}
            <div>
              <p className="text-sm text-gray-600">Trạng thái thanh toán</p>
              <p className="text-lg font-semibold">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  purchaseBill.status === 'payed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {purchaseBill.status === 'payed' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Trạng thái phê duyệt</p>
              <p className="text-lg font-semibold">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  purchaseBill.approveStatus === 'approved' ? 'bg-green-100 text-green-800' : 
                  purchaseBill.approveStatus === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {purchaseBill.approveStatus === 'approved' ? 'Đã phê duyệt' : 
                   purchaseBill.approveStatus === 'rejected' ? 'Đã từ chối' : 'Chờ phê duyệt'}
                </span>
              </p>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Danh sách sản phẩm</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn giá</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {purchaseBill.purchaseProducts?.map((product, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{product.productId?.productName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.productId?.purchasePrice?.toLocaleString() ?? 'N/A'} đ</td>
                      <td className="px-6 py-4 whitespace-nowrap">{((product.quantity || 0) * (product.productId?.purchasePrice || 0)).toLocaleString()} đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 font-semibold transition-all duration-300 ease-in-out"
            >
              Đóng
            </button>
            {purchaseBill.approveStatus === 'pending' && (
              <>
                <button
                  type="button"
                  onClick={() => handleApprove('approved')}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 ease-in-out font-semibold transform hover:scale-105"
                >
                  Phê duyệt
                </button>
                <button
                  type="button"
                  onClick={() => handleApprove('rejected')}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 ease-in-out font-semibold transform hover:scale-105"
                >
                  Từ chối
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseBillDetailModal;
