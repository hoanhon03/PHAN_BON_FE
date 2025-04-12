import { useState } from 'react';
import axios from 'axios';
import Switch from '../common/Switch';

const AddCategoryModal = ({ isOpen, onClose, onCategoryAdded }) => {
  const [categoryData, setCategoryData] = useState({
    categoryName: '',
    status: 'show'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleStatus = () => {
    setCategoryData(prev => ({
      ...prev,
      status: prev.status === 'show' ? 'hidden' : 'show'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const dataToSend = {
        ...categoryData
      };

      const requiredFields = ['categoryName', 'status'];
      const missingFields = requiredFields.filter(field => !dataToSend[field]);

      if (missingFields.length > 0) {
        alert(`Vui lòng điền đầy đủ thông tin: ${missingFields.join(', ')}`);
        setIsSubmitting(false);
        return;
      }

      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(`${import.meta.env.VITE_LOCAL_API_URL}/category`, dataToSend, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (response.status === 201) {
        if (typeof onCategoryAdded === 'function') {
          onCategoryAdded(response.data);
        }
        onClose();
        setCategoryData({
          categoryName: '',
          status: 'show'
        });
        alert('Danh mục đã được thêm thành công!');
        window.location.reload();
      }
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error.response?.data || error.message);
      alert("Có lỗi xảy ra khi thêm danh mục. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 ease-in-out">
        <div className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">Thêm danh mục mới</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục</label>
              <input
                type="text"
                name="categoryName"
                value={categoryData.categoryName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                required
              />
            </div>
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
              <label className="text-sm font-medium text-gray-700">Trạng thái</label>
              <div className="flex items-center space-x-2">
                <Switch
                  isOn={categoryData.status === 'show'}
                  handleToggle={handleToggleStatus}
                  onColor="bg-green-500"
                />
                <span className="text-sm text-gray-600">
                  {categoryData.status === 'show' ? 'Hiển thị' : 'Ẩn'}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-full hover:shadow-lg transition-all duration-300 ease-in-out font-semibold transform hover:scale-105"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 ease-in-out font-semibold transform hover:scale-105"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang thêm...' : 'Thêm danh mục'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;