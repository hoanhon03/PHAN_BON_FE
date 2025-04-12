import axios from "axios";
import React, { useState } from "react";

const EditCustomerModal = ({ customer, onClose }) => {
  const [formData, setFormData] = useState({
    ...customer,
  });
  const accessToken = localStorage.getItem("accessToken");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const listSaleinvoice = customer.listSaleinvoice.map(
      (invoice) => invoice._id
    );

    const response = await axios.put(
      `${import.meta.env.VITE_LOCAL_API_URL}/user/${customer._id}`,
      {
        userName: formData.userName,
        status: formData.status,
        userAddress: formData.userAddress,
        userPhone: formData.userPhone,
        userEmail: formData.userEmail,
        listSaleinvoice,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 200) {
      alert("Sửa thành công");
      window.location.reload();
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 ease-in-out">
        <div className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">
            Chỉnh sửa khách hàng
          </h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Tên khách hàng</label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => {
                  setFormData({ ...formData, userName: e.target.value });
                }}
              />
            </div>
            <div>
              <label>Địa chỉ khách hàng</label>
              <textarea
                type="text"
                value={formData.userAddress}
                onChange={(e) => {
                  setFormData({ ...formData, userAddress: e.target.value });
                }}
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                value={formData.userEmail}
                onChange={(e) => {
                  setFormData({ ...formData, userEmail: e.target.value });
                }}
              />
            </div>
            <div>
              <label>Điện thoại khách hàng</label>
              <input
                type="text"
                value={formData.userPhone}
                onChange={(e) => {
                  setFormData({ ...formData, userPhone: e.target.value });
                }}
              />
            </div>
            <div>
              <label>Tình trạng</label>
              <select
                defaultValue={formData.status}
                onChange={(e) => {
                  setFormData({ ...formData, status: e.target.value });
                }}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <button type="submit">Chỉnh sửa</button>
          </form>
          <button onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default EditCustomerModal;
