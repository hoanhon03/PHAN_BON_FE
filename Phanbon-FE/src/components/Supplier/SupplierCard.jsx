import React, { useState } from 'react';
import SupplierDetailModal from './SupplierDetailModal';
import GradientBorderBox from '../../duong-vien/GradientBorderbox';

const SupplierCard = ({ supplier, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdate = (updatedSupplier) => {
    onUpdate(updatedSupplier);
    handleCloseModal();
  };

  return (
    <GradientBorderBox>
      <div className="hidden md:grid grid-cols-6 gap-4 p-4 items-center hover:bg-gray-50 transition-colors duration-150">
        <div className="col-span-1 text-sm text-center">{supplier.supplierId}</div>
        <div className="col-span-2 text-sm font-medium text-center">{supplier.supplierName}</div>
        <div className="col-span-1 text-sm text-center">{supplier.supplierPhone}</div>
        <div className="col-span-1 text-sm text-center">{supplier.supplierEmail}</div>
        <div className="col-span-1">
          <button
            onClick={handleOpenModal}
            className="w-full bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white px-3 py-1 rounded-full hover:shadow-lg transition-all duration-300 ease-in-out font-semibold transform hover:scale-105 text-sm"
          >
            Chi tiết
          </button>
        </div>
      </div>

      <div className="md:hidden p-4 border-b">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">{supplier.supplierName}</span>
          <button
            onClick={handleOpenModal}
            className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white px-3 py-1 rounded-full hover:shadow-lg transition-all duration-300 ease-in-out font-semibold transform hover:scale-105 text-sm"
          >
            Chi tiết
          </button>
        </div>
        <div className="text-sm text-gray-600">
          <p>Mã NCC: {supplier.supplierId}</p>
          <p>SĐT: {supplier.supplierPhone}</p>
          <p>Email: {supplier.supplierEmail}</p>
        </div>
      </div>

      {isModalOpen && (
        <SupplierDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          supplier={supplier}
          onUpdate={handleUpdate}
        />
      )}
    </GradientBorderBox>
  );
};

export default SupplierCard;