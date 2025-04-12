import React, { useState } from "react";
import axios from "axios";
import Switch from '../common/Switch';

const CategoryDetailModal = ({ category, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedCategory, setEditedCategory] = useState({
    ...category,
    categoryName: category.categoryName || "",
    status: category.status || "show",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleStatus = () => {
    setEditedCategory(prev => ({
      ...prev,
      status: prev.status === 'show' ? 'hidden' : 'show'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!editedCategory.categoryName.trim()) {
      alert("Vui lòng nhập tên danh mục");
      setIsLoading(false);
      return;
    }

    const updatedCategory = {
      _id: category._id,
      categoryName: editedCategory.categoryName.trim(),
      status: editedCategory.status,
    };

    try {
      await onUpdate(updatedCategory);
      setIsEditing(false);
      alert("Danh mục đã được cập nhật thành công!");
      onClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);
      alert("Có lỗi xảy ra khi cập nhật danh mục. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 ease-in-out">
        <div className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">Chi tiết danh mục</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">ID</p>
              <p className="text-lg font-semibold">{category._id}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Tên danh mục</label>
              {isEditing ? (
                <input
                  type="text"
                  name="categoryName"
                  value={editedCategory.categoryName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              ) : (
                <p className="text-lg font-semibold">{category.categoryName}</p>
              )}
            </div>
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
              <label className="text-sm font-medium text-gray-700">Trạng thái</label>
              <div className="flex items-center space-x-2">
                <Switch
                  isOn={isEditing ? editedCategory.status === 'show' : category.status === 'show'}
                  handleToggle={isEditing ? handleToggleStatus : () => {}}
                  onColor="bg-green-500"
                  disabled={!isEditing}
                />
                <span className="text-sm text-gray-600">
                  {isEditing
                    ? (editedCategory.status === 'show' ? 'Hiển thị' : 'Ẩn')
                    : (category.status === 'show' ? 'Hiển thị' : 'Ẩn')}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Ngày tạo</p>
              <p className="text-base">{formatDate(category.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Ngày cập nhật</p>
              <p className="text-base">{formatDate(category.updatedAt)}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors duration-200"
                  disabled={isLoading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white rounded-full hover:shadow-lg transition-all duration-300 ease-in-out font-semibold transform hover:scale-105 flex items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang lưu...
                    </>
                  ) : 'Lưu'}
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

export default CategoryDetailModal;