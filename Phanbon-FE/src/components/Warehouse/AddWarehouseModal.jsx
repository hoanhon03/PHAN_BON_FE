import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Switch from '../common/Switch';

const AddWarehouseModal = ({ isOpen, onClose, onAddWarehouse }) => {
  const [warehouseData, setWarehouseData] = useState({
    wareHouseName: '',
    quantityNow: '',
    status: 'show'
  });
  const [productName, setProductName] = useState('');
  const [products, setProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const productInputRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    console.log("URL API:", `${import.meta.env.VITE_LOCAL_API_URL}/warehouse`);
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error("Không tìm thấy accessToken");
      // Có thể chuyển hướng người dùng đến trang đăng nhập ở đây
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`${import.meta.env.VITE_LOCAL_API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log("Dữ liệu sản phẩm:", response.data);
      setProducts(response.data.products);
      setFilteredProducts(response.data.products);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      console.log("Chi tiết lỗi:", error.response);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'productName') {
      setProductName(value);
      filterProducts(value);
      setShowProductDropdown(true);
    } else {
      setWarehouseData(prev => ({ ...prev, [name]: value }));
    }
  };

  const filterProducts = (searchTerm) => {
    if (!searchTerm) {
      setFilteredProducts(products);
      return;
    }
    const filtered = products.filter(product => 
      product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleProductSelect = (product) => {
    setProductName(product.productName);
    setShowProductDropdown(false);
  };

  const handleClickOutside = (e) => {
    if (productInputRef.current && !productInputRef.current.contains(e.target)) {
      setShowProductDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleStatus = () => {
    setWarehouseData(prev => ({
      ...prev,
      status: prev.status === 'show' ? 'hidden' : 'show'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const selectedProduct = products.find(p => p.productName === productName);
      if (!selectedProduct) {
        alert("Vui lòng chọn một sản phẩm hợp lệ");
        setIsSubmitting(false);
        return;
      }

      const dataToSend = {
        ...warehouseData,
        productId: selectedProduct._id,
        quantityNow: parseInt(warehouseData.quantityNow),
      };

      console.log("Dữ liệu gửi đi:", dataToSend);

      // Kiểm tra xem tất cả các trường bắt buộc có giá trị hợp lệ không
      if (!dataToSend.wareHouseName || !dataToSend.productId || isNaN(dataToSend.quantityNow)) {
        throw new Error("Vui lòng điền đầy đủ thông tin hợp lệ");
      }

      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(`${import.meta.env.VITE_LOCAL_API_URL}/warehouse`, dataToSend, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("Phản hồi từ server:", response);
      if (response.status === 201) {
        onAddWarehouse(response.data);
        onClose();
        setWarehouseData({
          wareHouseName: '',
          quantityNow: '',
          status: 'show'
        });
        setProductName('');
        alert('Kho đã được thêm thành công!');
      }
    } catch (error) {
      console.error("Lỗi khi thêm kho:", error);
      if (error.response) {
        console.error("Phản hồi từ server:", error.response.data);
        console.error("Mã trạng thái:", error.response.status);
        console.error("Headers:", error.response.headers);
        if (error.response.status === 500) {
          alert("Lỗi server nội bộ. Vui lòng thử lại sau hoặc liên hệ quản trị viên.");
        } else {
          alert(`Lỗi: ${error.response.data.message || 'Không có thông báo lỗi cụ thể'}`);
        }
      } else if (error.request) {
        console.error("Không nhận được phản hồi:", error.request);
        alert("Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối mạng.");
      } else {
        console.error("Lỗi khi thiết lập yêu cầu:", error.message);
        alert(`Lỗi: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden transform transition-all duration-300 ease-in-out">
        <div className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">Thêm kho mới</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên kho</label>
              <input
                type="text"
                name="wareHouseName"
                value={warehouseData.wareHouseName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                required
              />
            </div>
            <div className="relative" ref={productInputRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sản phẩm</label>
              <input
                type="text"
                name="productName"
                value={productName}
                onChange={handleChange}
                onClick={() => setShowProductDropdown(true)}
                className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                required
              />
              {showProductDropdown && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <li
                        key={product._id}
                        onClick={() => handleProductSelect(product)}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {product.productName}
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-gray-500">Không tìm thấy sản phẩm phù hợp</li>
                  )}
                </ul>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng hiện tại</label>
              <input
                type="number"
                name="quantityNow"
                value={warehouseData.quantityNow}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                required
              />
            </div>
            <div className="col-span-1 md:col-span-2 flex items-center justify-between bg-gray-50 p-4 rounded-xl">
              <label className="text-sm font-medium text-gray-700">Trạng thái</label>
              <div className="flex items-center space-x-2">
                <Switch
                  isOn={warehouseData.status === 'show'}
                  handleToggle={handleToggleStatus}
                  onColor="bg-green-500"
                />
                <span className="text-sm text-gray-600">
                  {warehouseData.status === 'show' ? 'Hiển thị' : 'Ẩn'}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 font-semibold transition-all duration-300 ease-in-out"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 ease-in-out font-semibold transform hover:scale-105"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang thêm...' : 'Thêm kho'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWarehouseModal;