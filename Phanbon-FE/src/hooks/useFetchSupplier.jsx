import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchSupplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSuppliers = useCallback(async () => {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`${import.meta.env.VITE_LOCAL_API_URL}/supplier`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setSuppliers(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
      setError("Không thể lấy danh sách nhà cung cấp. Vui lòng thử lại sau.");
      setIsLoading(false);
    }
  }, []);

  const addSupplier = useCallback(async (newSupplier) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(`${import.meta.env.VITE_LOCAL_API_URL}/supplier`, newSupplier, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      setSuppliers(prevSuppliers => [...prevSuppliers, response.data]);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi thêm nhà cung cấp:", error);
      throw error;
    }
  }, []);

  const updateSupplier = useCallback(async (updatedSupplier) => {
    try {
      if (!updatedSupplier._id) {
        throw new Error('Supplier ID không tồn tại');
      }
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.put(`${import.meta.env.VITE_LOCAL_API_URL}/supplier/${updatedSupplier._id}`, updatedSupplier, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setSuppliers(prevSuppliers => 
        prevSuppliers.map(supplier => 
          supplier._id === updatedSupplier._id ? response.data : supplier
        )
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật nhà cung cấp:", error.response?.data || error.message);
      throw error;
    }
  }, []);

  const deleteSupplier = useCallback(async (supplierId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.delete(`${import.meta.env.VITE_LOCAL_API_URL}/supplier/${supplierId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setSuppliers(prevSuppliers => prevSuppliers.filter(supplier => supplier._id !== supplierId));
    } catch (error) {
      console.error("Lỗi khi xóa nhà cung cấp:", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  return { suppliers, isLoading, error, fetchSuppliers, addSupplier, updateSupplier, deleteSupplier };
};

export default useFetchSupplier;