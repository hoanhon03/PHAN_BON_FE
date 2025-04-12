import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchWarehouse = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWarehouses = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`${import.meta.env.VITE_LOCAL_API_URL}/warehouse`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setWarehouses(response.data.warehouses);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWarehouses();
  }, [fetchWarehouses]);

  const updateWarehouse = useCallback(async (updatedWarehouse) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.put(
        `${import.meta.env.VITE_LOCAL_API_URL}/warehouse/${updatedWarehouse._id}`,
        updatedWarehouse,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setWarehouses(prevWarehouses => 
        prevWarehouses.map(wh => 
          wh._id === updatedWarehouse._id ? response.data : wh
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật kho:", error);
      throw error;
    }
  }, []);

  return { warehouses, isLoading, error, updateWarehouse, fetchWarehouses };
};

export default useFetchWarehouse;
