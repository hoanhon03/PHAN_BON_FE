import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AddSaleBillModal = ({ isOpen, closeModal, onAddSaleBill }) => {
  const [formData, setFormData] = useState({
    userId: '',
    saleProduct: [{ productId: '', quantityProduct: 1 }],
    statusSalesInvoice: 'active'
  });
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [productSearchTerms, setProductSearchTerms] = useState(['']);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([[]]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showProductDropdowns, setShowProductDropdowns] = useState([false]);

  const customerDropdownRef = useRef(null);
  const productDropdownRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
      fetchProducts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (Array.isArray(customers)) {
      const filtered = customers.filter(customer => 
        customer.userName.toLowerCase().includes(customerSearchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [customerSearchTerm, customers]);

  useEffect(() => {
    if (Array.isArray(products)) {
      const filtered = productSearchTerms.map(term => 
        products.filter(product => 
          product.productName.toLowerCase().includes(term.toLowerCase())
        )
      );
      setFilteredProducts(filtered);
    }
  }, [productSearchTerms, products]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (customerDropdownRef.current && !customerDropdownRef.current.contains(event.target)) {
        setShowCustomerDropdown(false);
      }
      productDropdownRefs.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target)) {
          setShowProductDropdowns(prev => {
            const newState = [...prev];
            newState[index] = false;
            return newState;
          });
        }
      });
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchCustomers = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`${import.meta.env.VITE_LOCAL_API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (Array.isArray(response.data)) {
        setCustomers(response.data);
      } else {
        console.error("Dữ liệu khách hàng không phải là mảng:", response.data);
        setCustomers([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khách hàng:", error);
      setCustomers([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`${import.meta.env.VITE_LOCAL_API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      } else {
        console.error("Dữ liệu sản phẩm không phải là mảng:", response.data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      setProducts([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCustomerSelect = (customer) => {
    setFormData(prevState => ({
      ...prevState,
      userId: customer._id
    }));
    setCustomerSearchTerm(customer.userName);
    setShowCustomerDropdown(false);
  };

  const handleProductSelect = (index, product) => {
    const newSaleProduct = [...formData.saleProduct];
    newSaleProduct[index].productId = product._id;
    setFormData(prevState => ({
      ...prevState,
      saleProduct: newSaleProduct
    }));
    const newProductSearchTerms = [...productSearchTerms];
    newProductSearchTerms[index] = product.productName;
    setProductSearchTerms(newProductSearchTerms);
    setShowProductDropdowns(prev => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });
  };

  const handleItemChange = (index, field, value) => {
    const newSaleProduct = [...formData.saleProduct];
    newSaleProduct[index][field] = value;
    setFormData(prevState => ({
      ...prevState,
      saleProduct: newSaleProduct
    }));
  };

  const addItem = () => {
    setFormData(prevState => ({
      ...prevState,
      saleProduct: [...prevState.saleProduct, { productId: '', quantityProduct: 1 }]
    }));
    setProductSearchTerms(prev => [...prev, '']);
    setShowProductDropdowns(prev => [...prev, false]);
  };

  const removeItem = (index) => {
    const newSaleProduct = formData.saleProduct.filter((_, i) => i !== index);
    setFormData(prevState => ({
      ...prevState,
      saleProduct: newSaleProduct
    }));
    const newProductSearchTerms = productSearchTerms.filter((_, i) => i !== index);
    setProductSearchTerms(newProductSearchTerms);
    setShowProductDropdowns(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      saleProduct: formData.saleProduct.map(item => ({
        productId: item.productId,
        quantityProduct: parseInt(item.quantityProduct)
      }))
    };
    console.log("Dữ liệu gửi đi:", dataToSend);
  
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(
        `${import.meta.env.VITE_LOCAL_API_URL}/salesinvoice/create`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      console.log("Phản hồi từ server:", response.data);
      // Xử lý phản hồi thành công
      if (response.status === 201 || response.status === 200) {
        await onAddSaleBill(response.data);
        closeModal();
        alert('Hóa đơn đã được thêm thành công!');
      } else {
        throw new Error('Phản hồi không như mong đợi');
      }
    } catch (error) {
      console.error("Chi tiết lỗi:", error);
      if (error.response) {
        console.error("Dữ liệu phản hồi:", error.response.data);
        console.error("Mã trạng thái:", error.response.status);
      }
      alert(`Có lỗi xảy ra khi thêm hóa đơn: ${error.response?.data?.message || error.message}`);
    }
  };

  useEffect(() => {
    console.log("URL API:", `${import.meta.env.VITE_LOCAL_API_URL}/salesinvoice/create`);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Thêm Hóa Đơn Bán</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative" ref={customerDropdownRef}>
            <label className="block text-sm font-medium text-gray-700">Tên khách hàng</label>
            <input
              type="text"
              value={customerSearchTerm}
              onChange={(e) => {
                setCustomerSearchTerm(e.target.value);
                setShowCustomerDropdown(true);
              }}
              onFocus={() => setShowCustomerDropdown(true)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Tìm kiếm khách hàng..."
            />
            {showCustomerDropdown && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-auto rounded-md shadow-lg">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <li
                      key={customer._id}
                      onClick={() => handleCustomerSelect(customer)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {customer.userName}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500">Không tìm thấy khách hàng</li>
                )}
              </ul>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Sản phẩm</label>
            {formData.saleProduct.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                <div className="relative w-1/2" ref={el => productDropdownRefs.current[index] = el}>
                  <input
                    type="text"
                    placeholder="Tìm sản phẩm"
                    value={productSearchTerms[index]}
                    onChange={(e) => {
                      const newTerms = [...productSearchTerms];
                      newTerms[index] = e.target.value;
                      setProductSearchTerms(newTerms);
                      setShowProductDropdowns(prev => {
                        const newState = [...prev];
                        newState[index] = true;
                        return newState;
                      });
                    }}
                    onFocus={() => {
                      setShowProductDropdowns(prev => {
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
                        <li className="px-4 py-2 text-gray-500">Không tìm thấy sản phẩm</li>
                      )}
                    </ul>
                  )}
                </div>
                <input
                  type="number"
                  placeholder="Số lượng"
                  value={item.quantityProduct}
                  onChange={(e) => handleItemChange(index, 'quantityProduct', parseInt(e.target.value))}
                  className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  min="1"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Xóa
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="mt-2 px-4 py-2 bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white rounded-full hover:shadow-lg transition-all duration-300 ease-in-out font-semibold transform hover:scale-105"
            >
              Thêm sản phẩm
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
            <select
              name="statusSalesInvoice"
              value={formData.statusSalesInvoice}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="active">Hoàn tất</option>
              <option value="inactive">Còn nợ</option>
            </select>
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 font-semibold transition-all duration-300 ease-in-out"
            >
              Hủy
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 ease-in-out font-semibold transform hover:scale-105"
            >
              Thêm hóa đơn
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSaleBillModal;