import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchDashboard = (startDate, endDate) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`${import.meta.env.VITE_LOCAL_API_URL}/revenue-report/date-range`, {
        params: { startDate, endDate },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
        
      });
      console.log('Gọi API với params:', { startDate, endDate });
      setData(response.data);
    } catch (err) {
      console.error('Lỗi khi gọi API:', err.response?.data || err.message);
      setError(err.response?.data?.message || err.message);
      
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetchDashboard;