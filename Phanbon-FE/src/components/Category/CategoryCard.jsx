import React, { useState } from 'react';
import CategoryDetailModal from './CategoryDetailModal';

const CategoryCard = ({ category, onUpdateCategory }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleUpdate = (updatedCategory) => {
    if (typeof onUpdateCategory === 'function') {
      onUpdateCategory(updatedCategory);
    }
    closeModal();
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <>
      <div className="p-4 hover:bg-gray-50 transition-colors duration-150">
        {/* Desktop layout */}
        <div className="hidden md:grid md:grid-cols-10 md:gap-4 items-center">
          <div className="col-span-4 text-sm font-medium text-gray-900">{category.categoryName}</div>
          <div className="col-span-2 text-sm">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              category.status === 'show' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {category.status === 'show' ? 'Hiển thị' : 'Ẩn'}
            </span>
          </div>
          <div className="col-span-3 text-sm text-gray-500">{formatDate(category.createdAt)}</div>
          <div className="col-span-1">
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
            <span className="font-semibold text-gray-700">Tên danh mục:</span>
            <span className="text-gray-900 font-medium">{category.categoryName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Trạng thái:</span>
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              category.status === 'show' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {category.status === 'show' ? 'Hiển thị' : 'Ẩn'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Ngày tạo:</span>
            <span className="text-gray-500">{formatDate(category.createdAt)}</span>
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
        <CategoryDetailModal 
          category={category} 
          onClose={closeModal} 
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
};

export default CategoryCard;