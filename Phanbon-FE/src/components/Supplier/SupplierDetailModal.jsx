import React, { useState } from 'react';
import useFetchSuppliers  from '../../hooks/useFetchSupplier';

const SupplierDetailModal = ({ supplier, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSupplier, setEditedSupplier] = useState({
    _id: supplier._id,
    supplierName: supplier.supplierName,
    supplierPhone: supplier.supplierPhone,
    supplierEmail: supplier.supplierEmail,
    supplierAddress: supplier.supplierAddress,
    status: supplier.status,
  });
  const { fetchSuppliers } = useFetchSuppliers()
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedSupplier(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    console.log('id có tồn tại không :', editedSupplier); // Thêm dòng này
    await onUpdate(editedSupplier);
    setIsEditing(false);
    fetchSuppliers();
  } catch (error) {
    console.error("Lỗi khi cập nhật nhà cung cấp:", error);
  }
};
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">Chi tiết nhà cung cấp</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-gray-600">Mã nhà cung cấp</p>
              <p className="text-lg font-semibold">{supplier.supplierId}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Tên nhà cung cấp</label>
              {isEditing ? (
                <input
                  type="text"
                  name="supplierName"
                  value={editedSupplier.supplierName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              ) : (
                <p className="text-lg font-semibold">{supplier.supplierName}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-600">Số điện thoại</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="supplierPhone"
                  value={editedSupplier.supplierPhone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              ) : (
                <p className="text-lg font-semibold">{supplier.supplierPhone}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-600">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="supplierEmail"
                  value={editedSupplier.supplierEmail}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              ) : (
                <p className="text-lg font-semibold">{supplier.supplierEmail}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-600">Địa chỉ</label>
              {isEditing ? (
                <input
                  type="text"
                  name="supplierAddress"
                  value={editedSupplier.supplierAddress}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              ) : (
                <p className="text-lg font-semibold">{supplier.supplierAddress}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-600">Trạng thái</label>
              {isEditing ? (
                <select
                  name="status"
                  value={editedSupplier.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              ) : (
                <p className="text-lg font-semibold">
                  {supplier.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </p>
              )}
            </div>
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
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
              >
                Chỉnh sửa
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors duration-200"
            >
              Đóng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierDetailModal;