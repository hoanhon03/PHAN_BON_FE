import React from 'react';

const WarehouseCard = ({ warehouse }) => {
  return (
    <>
      <div className="hidden md:grid grid-cols-5 gap-4 p-4 items-center hover:bg-gray-50 transition-colors duration-150">
        <div className="col-span-1 text-sm">{warehouse.productId.productId}</div>
        <div className="col-span-1 text-sm">{warehouse.productId.productName}</div>
        <div className="col-span-1 text-sm font-medium">{warehouse.wareHouseName}</div>
        <div className="col-span-1 text-sm">{warehouse.quantityNow}</div>
        <div className="col-span-1 text-sm">
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            warehouse.status === 'show' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {warehouse.status === 'show' ? 'Hiển thị' : 'Ẩn'}
          </span>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden p-4 space-y-2">
        <div className="flex justify-between">
          <span className="font-semibold">Mã SP:</span>
          <span>{warehouse.productId.productId}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Tên SP:</span>
          <span>{warehouse.productId.productName}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Tên kho:</span>
          <span>{warehouse.wareHouseName}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">SL hiện tại:</span>
          <span>{warehouse.quantityNow}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold">Trạng thái:</span>
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            warehouse.status === 'show' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {warehouse.status === 'show' ? 'Hiển thị' : 'Ẩn'}
          </span>
        </div>
      </div>
    </>
  );
};

export default WarehouseCard;
