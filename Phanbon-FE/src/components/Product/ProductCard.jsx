import React, { useState } from 'react';
import ProductDetailModal from './ProductDetailModal';

const ProductCard = ({ product, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleUpdate = async (updatedProduct) => {
    setIsUpdating(true);
    try {
      await onUpdate(updatedProduct);
      closeModal();
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      alert("Có lỗi xảy ra khi cập nhật sản phẩm. Vui lòng thử lại.");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return 'Chưa có giá';
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <>
      <div className="hidden md:grid grid-cols-8 gap-4 p-4 items-center hover:bg-gray-50 transition-colors duration-150">
        <div className="col-span-1 text-sm">{product.productId}</div>
        <div className="col-span-2 text-sm font-medium">{product.productName}</div>
        <div className="col-span-1 text-sm">{product.categoryId?.categoryName || 'Chưa phân loại'}</div>
        <div className="col-span-1 text-sm">{formatCurrency(product.purchasePrice)}</div>
        <div className="col-span-1 text-sm">{formatCurrency(product.salePice)}</div>
        <div className="col-span-1 text-sm">
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            product.status === 'show' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {product.status === 'show' ? 'Hiển thị' : 'Ẩn'}
          </span>
        </div>
        <div className="col-span-1">
          <button 
            onClick={openModal}
            className="w-full bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white px-3 py-1 rounded-full hover:shadow-lg transition-all duration-300 ease-in-out font-semibold transform hover:scale-105 text-sm"
            disabled={isUpdating}
          >
            {isUpdating ? 'Đang cập nhật...' : 'Chi tiết'}
          </button>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden p-4 space-y-2">
        <div className="flex justify-between">
          <span className="font-semibold">Mã SP:</span>
          <span>{product.productId}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Tên sản phẩm:</span>
          <span>{product.productName}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Danh mục:</span>
          <span>{product.categoryId?.categoryName || 'Chưa phân loại'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Giá mua:</span>
          <span>{formatCurrency(product.purchasePrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Giá bán:</span>
          <span>{formatCurrency(product.salePice)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold">Trạng thái:</span>
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            product.status === 'show' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {product.status === 'show' ? 'Hiển thị' : 'Ẩn'}
          </span>
        </div>
        <button 
          onClick={openModal}
          className="w-full bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 ease-in-out font-semibold transform hover:scale-105 text-sm mt-2"
          disabled={isUpdating}
        >
          {isUpdating ? 'Đang cập nhật...' : 'Chi tiết'}
        </button>
      </div>

      {isModalOpen && (
        <ProductDetailModal 
          product={product} 
          onClose={closeModal} 
          onUpdate={handleUpdate}
          isUpdating={isUpdating}
        />
      )}
    </>
  );
};

export default ProductCard;