import axios from "axios";
import React, { useState } from "react";

const AddCustomerModal = () => {
  const [formData, setFormData] = useState({
    status: "active",
    listSaleinvoice: [],
  });
  const accessToken = localStorage.getItem("accessToken");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      `${import.meta.env.VITE_LOCAL_API_URL}/user`,
      {
        ...formData,
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
  };
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 ease-in-out">
          <div className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] p-6 rounded-t-2xl">
            <h2 className="text-2xl font-bold text-white">Thêm khách hàng</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Tên khách hàng</label>
                <input
                  type="text"
                  onChange={(e) => {
                    setFormData({ ...formData, userName: e.target.value });
                  }}
                />
              </div>
              <div>
                <label>Địa chỉ khách hàng</label>
                <textarea
                  type="text"
                  onChange={(e) => {
                    setFormData({ ...formData, userAddress: e.target.value });
                  }}
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  onChange={(e) => {
                    setFormData({ ...formData, userEmail: e.target.value });
                  }}
                />
              </div>
              <div>
                <label>Điện thoại khách hàng</label>
                <input
                  type="text"
                  onChange={(e) => {
                    setFormData({ ...formData, userPhone: e.target.value });
                  }}
                />
              </div>
              <button type="submit">Thêm khách hàng</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCustomerModal;
