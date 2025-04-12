import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useFetchDashboard from '../hooks/useFetchDashboard';

const DashboardDateRange = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const { data, loading, error } = useFetchDashboard(
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0]
  );

  return (
    <div>
      <div>
        <label>Ngày bắt đầu: </label>
        <DatePicker
          selected={startDate}
          onChange={date => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
        />
      </div>
      <div>
        <label>Ngày kết thúc: </label>
        <DatePicker
          selected={endDate}
          onChange={date => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
        />
      </div>
      {loading && <p>Đang tải...</p>}
      {error && <p>Lỗi: {error}</p>}
      {data && (
        <div>
          {/* Hiển thị dữ liệu dashboard ở đây */}
        </div>
      )}
    </div>
  );
};

export default DashboardDateRange;