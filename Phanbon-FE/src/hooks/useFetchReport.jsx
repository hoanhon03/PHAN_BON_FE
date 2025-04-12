import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchReport = (date) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const controller = new AbortController();

    const fetchReport = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_LOCAL_API_URL}/revenue-report/date-range`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          signal: controller.signal
        });
        setReport(response.data);
        setLoading(false);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Yêu cầu đã bị hủy:', error.message);
        } else {
          console.error('Lỗi khi tải báo cáo:', error.response?.data || error.message);
          setError(`Đã xảy ra lỗi khi tải báo cáo: ${error.response?.data?.message || error.message}`);
        }
        setLoading(false);
      }
    };

    fetchReport();

    return () => {
      controller.abort();
    };
  }, [date, accessToken]);

  return { report, loading, error };
};

export default useFetchReport;