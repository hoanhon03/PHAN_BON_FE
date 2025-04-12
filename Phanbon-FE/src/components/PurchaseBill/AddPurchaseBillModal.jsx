import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const AddPurchaseBillModal = ({ isOpen, closeModal, onAddPurchaseBill }) => {
  const [formData, setFormData] = useState({
    supplierId: "",
    purchaseProducts: [{ productId: "", quantity: 0 }],
    approveStatus: "pending",
    paidAmount: 0,
    amountOwed: 0,
    paymentTems: 0,
    status: "",
  });
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("");
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [productSearchTerms, setProductSearchTerms] = useState([""]);
  const [filteredSupplier, setFilteredSupplier] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([[]]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showProductDropdowns, setShowProductDropdowns] = useState([false]);
  const accessToken = localStorage.getItem("accessToken");

  const supplierDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  const productDropdownRefs = useRef([]);
  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (Array.isArray(suppliers)) {
      const filtered = suppliers.filter((supplier) =>
        supplier.supplierName
          .toLowerCase()
          .includes(supplierSearchTerm.toLowerCase())
      );
      setFilteredSupplier(filtered);
    }
  }, [supplierSearchTerm, supplierSearchTerm]);

  useEffect(() => {
    if (Array.isArray(categories)) {
      const filtered = categories.filter((category) =>
        category.categoryName
          .toLowerCase()
          .includes(categorySearchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [categorySearchTerm, categories]);

  useEffect(() => {
    if (Array.isArray(products)) {
      const filtered = productSearchTerms.map((term) =>
        products.filter((product) =>
          product.productName.toLowerCase().includes(term.toLowerCase())
        )
      );
      setFilteredProducts(filtered);
    }
  }, [productSearchTerms, products]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
      }

      if (
        supplierDropdownRef.current &&
        !supplierDropdownRef.current.contains(event.target)
      ) {
        setShowSupplierDropdown(false);
      }
      productDropdownRefs.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target)) {
          setShowProductDropdowns((prev) => {
            const newState = [...prev];
            newState[index] = false;
            return newState;
          });
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_LOCAL_API_URL}/supplier`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setSuppliers(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_LOCAL_API_URL}/products`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setProducts(response.data.products);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_LOCAL_API_URL}/category`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setCategories(response.data.categories);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.purchaseProducts];
    updatedProducts[index][field] = value;
    setFormData((prev) => ({ ...prev, purchaseProducts: updatedProducts }));
  };

  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      purchaseProducts: [
        ...prev.purchaseProducts,
        { productId: "", quantity: 0, price: 0 },
      ],
    }));
  };

  const removeProduct = (index) => {
    const updatedProducts = formData.purchaseProducts.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({ ...prev, purchaseProducts: updatedProducts }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const adminId = localStorage.getItem("userId");
      if (formData.status === "") alert("Cần chọn loại hóa đơn");
      const response = await axios.post(
        `${import.meta.env.VITE_LOCAL_API_URL}/purchase-invoice`,
        {
          ...formData,
          approveStatus: "pending",
          adminId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 201) {
        alert("Thêm thành công");
        window.location.reload();
      }
    } catch (error) {
      console.error("Lỗi khi thêm hóa đơn mua:", error);
    }
  };

  const handleSupplierSelect = (supplier) => {
    setFormData((prevState) => ({
      ...prevState,
      supplierId: supplier._id,
    }));
    setSupplierSearchTerm(supplier.supplierName);
    setShowSupplierDropdown(false);
  };

  const handleCategorySelect = (category) => {
    setFormData((prevState) => ({
      ...prevState,
      categoryId: category._id,
    }));
    setCategorySearchTerm(category.categoryName);
    setShowCategoryDropdown(false);
  };

  const handleProductSelect = (index, product) => {
    const newPurchaseProduct = [...formData.purchaseProducts];
    newPurchaseProduct[index].productId = product._id;
    setFormData((prevState) => ({
      ...prevState,
      purchaseProducts: newPurchaseProduct,
    }));
    const newProductSearchTerms = [...productSearchTerms];
    newProductSearchTerms[index] = product.productName;
    setProductSearchTerms(newProductSearchTerms);
    setShowProductDropdowns((prev) => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">
            Thêm hóa đơn mua mới
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4 relative" ref={supplierDropdownRef}>
            <label className="block text-sm font-medium text-gray-700">
              Nhà cung cấp
            </label>
            <input
              type="text"
              value={supplierSearchTerm}
              onChange={(e) => {
                setSupplierSearchTerm(e.target.value);
                setShowSupplierDropdown(true);
              }}
              onFocus={() => setShowSupplierDropdown(true)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Tìm kiếm nhà cung cấp..."
            />
            {showSupplierDropdown && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-auto rounded-md shadow-lg">
                {filteredSupplier.length > 0 ? (
                  filteredSupplier.map((supplier) => (
                    <li
                      key={supplier._id}
                      onClick={() => handleSupplierSelect(supplier)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {supplier.supplierName}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500">
                    Không tìm thấy nhà cung cấp này
                  </li>
                )}
              </ul>
            )}
          </div>

          <div className="my-4 relative" ref={categoryDropdownRef}>
            <label className="block text-sm font-medium text-gray-700">
              Thể loại
            </label>
            <input
              type="text"
              value={categorySearchTerm}
              onChange={(e) => {
                setCategorySearchTerm(e.target.value);
                setShowCategoryDropdown(true);
              }}
              onFocus={() => setShowCategoryDropdown(true)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Tìm kiếm nhà cung cấp..."
            />
            {showCategoryDropdown && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-auto rounded-md shadow-lg">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <li
                      key={category._id}
                      onClick={() => handleCategorySelect(category)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {category.categoryName}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500">
                    Không tìm thấy nhà cung cấp này
                  </li>
                )}
              </ul>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Sản phẩm
            </label>
            {formData.purchaseProducts.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                <div
                  className="relative w-1/2"
                  ref={(el) => (productDropdownRefs.current[index] = el)}
                >
                  <input
                    type="text"
                    placeholder="Tìm sản phẩm"
                    value={productSearchTerms[index]}
                    onChange={(e) => {
                      const newTerms = [...productSearchTerms];
                      newTerms[index] = e.target.value;
                      setProductSearchTerms(newTerms);
                      setShowProductDropdowns((prev) => {
                        const newState = [...prev];
                        newState[index] = true;
                        return newState;
                      });
                    }}
                    onFocus={() => {
                      setShowProductDropdowns((prev) => {
                        const newState = [...prev];
                        newState[index] = true;
                        return newState;
                      });
                    }}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  {showProductDropdowns[index] && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-auto rounded-md shadow-lg">
                      {filteredProducts[index]?.length > 0 ? (
                        filteredProducts[index].map((product) => (
                          <li
                            key={product._id}
                            onClick={() => handleProductSelect(index, product)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {product.productName}
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-2 text-gray-500">
                          Không tìm thấy sản phẩm
                        </li>
                      )}
                    </ul>
                  )}
                </div>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleProductChange(index, "quantity", e.target.value)
                  }
                  placeholder="Số lượng"
                  className="block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />

                <button
                  type="button"
                  onClick={() => removeProduct(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Xóa
                </button>
              </div>
            ))}
            <label className="block text-sm font-medium text-gray-700">
              Lượng bán
            </label>
            <input
              type="number"
              onChange={(e) => {
                setFormData({ ...formData, paidAmount: e.target.value });
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Nhập lượng bán"
            />
            <label className="block text-sm font-medium text-gray-700">
              Lượng sở hữu
            </label>
            <input
              type="number"
              onChange={(e) => {
                setFormData({ ...formData, amountOwed: e.target.value });
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Nhập lượng sở hữu"
            />
            <label className="block text-sm font-medium text-gray-700">
              Loại chi trả
            </label>
            <input
              type="number"
              onChange={(e) => {
                setFormData({ ...formData, paymentTems: e.target.value });
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Nhập loại hạn trả"
            />

            <button
              type="button"
              onClick={addProduct}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Thêm sản phẩm
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Trạng thái
            </label>
            <select
              name="status"
              required
              defaultValue={""}
              value={formData.status}
              onChange={(e) => {
                setFormData({ ...formData, status: e.target.value });
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option hidden name="" value=""></option>
              <option name="value" value="payed">
                Đã trả
              </option>
              <option name="unpay" value="unpay">
                Chưa trả
              </option>
            </select>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Thêm hóa đơn
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPurchaseBillModal;
