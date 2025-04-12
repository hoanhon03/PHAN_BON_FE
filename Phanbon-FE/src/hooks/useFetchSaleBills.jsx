import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchSaleBills = () => {
  const [saleBills, setSaleBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSaleBills = useCallback(async () => {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(
        `${import.meta.env.VITE_LOCAL_API_URL}/salesinvoice`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setSaleBills(response.data.invoices);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSaleBills();
  }, [fetchSaleBills]);

  const addSaleBill = useCallback(async (newBill) => {
    setSaleBills(prevBills => [newBill, ...prevBills]);
    await fetchSaleBills(); // Tải lại toàn bộ danh sách sau khi thêm
  }, [fetchSaleBills]);

  const updateSaleBill = useCallback((updatedBill) => {
    setSaleBills(prevBills =>
      prevBills.map(bill => bill._id === updatedBill._id ? updatedBill : bill)
    );
  }, []);

  return { saleBills, isLoading, error, updateSaleBill, addSaleBill, fetchSaleBills };
};

export default useFetchSaleBills;
