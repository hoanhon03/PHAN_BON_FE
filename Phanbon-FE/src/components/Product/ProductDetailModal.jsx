import React, { useState, useEffect, useRef, useReducer } from "react";
import axios from "axios";
import useFetchCategories from "../../hooks/useFetchCategories";
import Switch from '../common/Switch';

const ProductDetailModal = ({ product, onClose, onUpdate, isUpdating }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({
    ...product,
    categoryId: product.categoryId._id || "",
    productName: product.productName || "",
    describeProduct: product.describeProduct || "",
    status: product.status || "show",
    unit: product.unit || "",
    purchasePrice: product.purchasePrice || 0,
    salePice: product.salePice || 0,
  });
  const [categoryName, setCategoryName] = useState(
    product.categoryId.categoryName || ""
  );
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useFetchCategories();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const categoryInputRef = useRef(null);

  useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);

  const searchCategory = async (name) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_LOCAL_API_URL
        }/category/search?searchKey=${encodeURIComponent(name)}`
      );
      console.log("Kết quả tìm kiếm danh mục:", response.data);
      if (response.data.categories && response.data.categories.length > 0) {
        return response.data.categories[0];
      }
      return null;
    } catch (error) {
      console.error("Lỗi khi tìm kiếm danh mục:", error);
      if (error.response) {
        console.error("Dữ liệu lỗi:", error.response.data);
        console.error("Mã trạng thái:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        console.error("Không nhận được phản hồi:", error.request);
      } else {
        console.error("Lỗi:", error.message);
      }
      return null;
    }
  };

  const findCategory = async () => {
    if (categoryName && !categoriesLoading && categories) {
      try {
        const foundCategory =
          categories.find(
            (c) => c.categoryName.toLowerCase() === categoryName.toLowerCase()
          ) || (await searchCategory(categoryName));
        if (foundCategory) {
          setEditedProduct((prev) => ({
            ...prev,
            categoryId: foundCategory._id,
          }));
          return true;
        } else {
          alert("Không tìm thấy category này");
          return false;
        }
      } catch (error) {}
    }
  };

  useEffect(() => {
    if (
      editedProduct.categoryId &&
      typeof editedProduct.categoryId === "object"
    ) {
      setCategoryName(editedProduct.categoryId.categoryName || "");
    }
  }, [editedProduct]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "categoryName") {
      setCategoryName(value);
      filterCategories(value);
      setShowCategoryDropdown(true);
    } else if (["purchasePrice", "salePice"].includes(name)) {
      setEditedProduct((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setEditedProduct((prev) => ({ ...prev, [name]: value }));
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
    setEditedProduct(prev => ({ ...prev, categoryId: category._id }));
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
    setEditedProduct(prev => ({
      ...prev,
      status: prev.status === 'show' ? 'hidden' : 'show'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "categoryId",
      "productName",
      "unit",
      "purchasePrice",
      "salePice",
      "status",
    ];
    const missingFields = requiredFields.filter(
      (field) => !editedProduct[field]
    );

    const foundCategory = await findCategory();
    if (!foundCategory) return;

    if (missingFields.length > 0) {
      alert(`Vui lòng điền đầy đủ thông tin: ${missingFields.join(", ")}`);
      return;
    }

    // Tạo một đối tượng mới chỉ chứa các trường cần thiết
    const updatedProduct = {
      categoryId: editedProduct.categoryId,
      productName: editedProduct.productName,
      describeProduct: editedProduct.describeProduct || "", // Gửi chuỗi rỗng nếu mô tả trống
      status: editedProduct.status,
      unit: editedProduct.unit,
      purchasePrice: editedProduct.purchasePrice,
      salePice: editedProduct.salePice,
    };

    console.log("Dữ liệu gửi đi:", updatedProduct);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.put(
        `${import.meta.env.VITE_LOCAL_API_URL}/products/${product._id}`,
        updatedProduct,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      if (response.status === 200) {
        const updatedProductData = response.data;

        // Cập nhật tất cả các state liên quan
        setEditedProduct(updatedProductData);
        setCategoryName(updatedProductData.categoryId.categoryName || "");

        onUpdate(updatedProductData);
        setIsEditing(false);
        alert("Sản phẩm đã được cập nhật thành công!");
        forceUpdate(); // Bắt buộc re-render
        window.location.reload();
      }
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật sản phẩm:",
        error.response?.data || error.message
      );
      console.error("Chi tiết lỗi:", error.response);
      if (error.response?.data?.message) {
        alert(`Lỗi: ${JSON.stringify(error.response.data.message)}`);
      } else {
        alert("Có lỗi xảy ra khi cập nhật sản phẩm. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 ease-in-out">
        <div className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">Chi tiết sản phẩm</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <p className="text-sm text-gray-600">Mã sản phẩm</p>
              <p className="text-lg font-semibold">{product.productId}</p>
            </div>
            <div className="col-span-2">
              <label className="text-sm text-gray-600">Tên sản phẩm</label>
              {isEditing ? (
                <input
                  type="text"
                  name="productName"
                  value={editedProduct.productName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              ) : (
                <p className="text-lg font-semibold">{product.productName}</p>
              )}
            </div>
            <div className="col-span-2 relative" ref={categoryInputRef}>
              <label className="text-sm text-gray-600">Danh mục</label>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="categoryName"
                    value={categoryName}
                    onChange={handleInputChange}
                    onClick={() => setShowCategoryDropdown(true)}
                    className="w-full p-2 border rounded-md"
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
                </>
              ) : (
                <p className="text-lg font-semibold">{categoryName}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-600">Đơn vị</label>
              {isEditing ? (
                <input
                  type="text"
                  name="unit"
                  value={editedProduct.unit}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              ) : (
                <p className="text-lg font-semibold">{product.unit}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-600">Giá mua</label>
              {isEditing ? (
                <input
                  type="number"
                  name="purchasePrice"
                  value={editedProduct.purchasePrice}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              ) : (
                <p className="text-lg font-semibold text-blue-600">
                  {product.purchasePrice.toLocaleString()} đ
                </p>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-600">Giá bán</label>
              {isEditing ? (
                <input
                  type="number"
                  name="salePice"
                  value={editedProduct.salePice}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              ) : (
                <p className="text-lg font-semibold text-green-600">
                  {product.salePice.toLocaleString()} đ
                </p>
              )}
            </div>
            <div className="col-span-2 flex items-center justify-between bg-gray-50 p-4 rounded-xl">
              <label className="text-sm font-medium text-gray-700">Trạng thái</label>
              <div className="flex items-center space-x-2">
                <Switch
                  isOn={isEditing ? editedProduct.status === 'show' : product.status === 'show'}
                  handleToggle={isEditing ? handleToggleStatus : () => {}}
                  onColor="bg-green-500"
                  disabled={!isEditing}
                />
                <span className="text-sm text-gray-600">
                  {isEditing
                    ? (editedProduct.status === 'show' ? 'Hiển thị' : 'Ẩn')
                    : (product.status === 'show' ? 'Hiển thị' : 'Ẩn')}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label className="text-sm text-gray-600">Mô tả</label>
            {isEditing ? (
              <textarea
                name="describeProduct"
                value={editedProduct.describeProduct || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                rows="3"
              />
            ) : (
              <p className="text-base mt-1">{product.describeProduct || "Không có mô tả"}</p>
            )}
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors duration-200"
                  disabled={isUpdating}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white rounded-full hover:shadow-lg transition-all duration-300 ease-in-out font-semibold transform hover:scale-105 flex items-center"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
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

export default ProductDetailModal;
