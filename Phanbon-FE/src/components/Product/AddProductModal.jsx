import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Switch from '../common/Switch';
import useFetchCategories from "../../hooks/useFetchCategories";

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
  const [productData, setProductData] = useState({
    productName: '',
    describeProduct: '',
    unit: '',
    purchasePrice: '',
    salePice: '',
    status: 'show'
  });
  const [categoryName, setCategoryName] = useState('');
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useFetchCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const categoryInputRef = useRef(null);

  useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'categoryName') {
      setCategoryName(value);
      filterCategories(value);
      setShowCategoryDropdown(true);
    } else if (['purchasePrice', 'salePice'].includes(name)) {
      setProductData(prev => ({ ...prev, [name]: value }));
    } else {
      setProductData(prev => ({ ...prev, [name]: value }));
    }
  };

  const filterCategories = (searchTerm) => {
    if (!searchTerm) {
      setFilteredCategories(categories);
      return;
    }
    const filtered = categories.filter(category => 
      category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const handleCategorySelect = (category) => {
    setCategoryName(category.categoryName);
    setShowCategoryDropdown(false);
  };

  const handleClickOutside = (e) => {
    if (categoryInputRef.current && !categoryInputRef.current.contains(e.target)) {
      setShowCategoryDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleStatus = () => {
    setProductData(prev => ({
      ...prev,
      status: prev.status === 'show' ? 'hidden' : 'show'
    }));
  };

  const searchCategory = async (name) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_LOCAL_API_URL}/category/search?searchKey=${encodeURIComponent(name)}`);
      if (response.data.categories && response.data.categories.length > 0) {
        return response.data.categories[0];
      }
      return null;
    } catch (error) {
      console.error("Lỗi khi tìm kiếm danh mục:", error);
      return null;
    }
  };

  const findCategory = async () => {
    if (categoryName && !categoriesLoading && categories) {
      try {
        const foundCategory = categories.find(c => c.categoryName.toLowerCase() === categoryName.toLowerCase()) || await searchCategory(categoryName);
        if (foundCategory) {
          return foundCategory._id;
        } else {
          alert("Không tìm thấy danh mục này");
          return null;
        }
      } catch (error) {
        console.error("Lỗi khi tìm danh mục:", error);
        return null;
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const categoryId = await findCategory();
      if (!categoryId) {
        setIsSubmitting(false);
        return;
      }

      const dataToSend = {
        ...productData,
        categoryId,
        purchasePrice: parseFloat(productData.purchasePrice),
        salePice: parseFloat(productData.salePice),
        describeProduct: productData.describeProduct || null // Gửi null nếu mô tả trống
      };

      const requiredFields = ['categoryId', 'productName', 'unit', 'purchasePrice', 'salePice', 'status'];
      const missingFields = requiredFields.filter(field => !dataToSend[field]);

      if (missingFields.length > 0) {
        alert(`Vui lòng điền đầy đủ thông tin: ${missingFields.join(', ')}`);
        setIsSubmitting(false);
        return;
      }

      console.log("Dữ liệu gửi đi:", dataToSend);
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(`${import.meta.env.VITE_LOCAL_API_URL}/products`, dataToSend, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (response.status === 201) {
        if (typeof onProductAdded === 'function') {
          onProductAdded(response.data);
        }
        onClose();
        setProductData({
          productName: '',
          describeProduct: '',
          unit: '',
          purchasePrice: '',
          salePice: '',
          status: 'show'
        });
        setCategoryName('');
        alert('Sản phẩm đã được thêm thành công!');
        window.location.reload();
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error.response?.data || error.message);
      alert("Có lỗi xảy ra khi thêm sản phẩm. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden transform transition-all duration-300 ease-in-out">
        <div className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">Thêm sản phẩm mới</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
              <input
                type="text"
                name="productName"
                value={productData.productName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                required
              />
            </div>
            <div className="relative" ref={categoryInputRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <input
                type="text"
                name="categoryName"
                value={categoryName}
                onChange={handleChange}
                onClick={() => setShowCategoryDropdown(true)}
                className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                required
              />
              {showCategoryDropdown && !categoriesLoading && !categoriesError && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <li
                        key={category._id}
                        onClick={() => handleCategorySelect(category)}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {category.categoryName}
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-gray-500">Không tìm thấy danh mục phù hợp</li>
                  )}
                </ul>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị</label>
              <input
                type="text"
                name="unit"
                value={productData.unit}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giá mua</label>
              <input
                type="number"
                name="purchasePrice"
                value={productData.purchasePrice}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán</label>
              <input
                type="number"
                name="salePice"
                value={productData.salePice}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                required
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea
                name="describeProduct"
                value={productData.describeProduct}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                rows="3"
              ></textarea>
            </div>
            <div className="col-span-1 md:col-span-2 flex items-center justify-between bg-gray-50 p-4 rounded-xl">
              <label className="text-sm font-medium text-gray-700">Trạng thái</label>
              <div className="flex items-center space-x-2">
                <Switch
                  isOn={productData.status === 'show'}
                  handleToggle={handleToggleStatus}
                  onColor="bg-green-500"
                />
                <span className="text-sm text-gray-600">
                  {productData.status === 'show' ? 'Hiển thị' : 'Ẩn'}
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
              {isSubmitting ? 'Đang thêm...' : 'Thêm sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;