import React, { useState } from "react";
import useFetchRoles from "../../hooks/useFetchRoles";
import axios from "axios";

const AddStaffModal = ({ onClose }) => {
  const roles = useFetchRoles();
  const [formData, setFormData] = useState();
  const [checkedBoxes, setCheckedBoxes] = useState([]);
  const accessToken = localStorage.getItem("accessToken");
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      // Add the selected checkbox to the state
      setCheckedBoxes([...checkedBoxes, value]);
    } else {
      // Remove the deselected checkbox from the state
      setCheckedBoxes(checkedBoxes.filter((item) => item !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData) throw new Error("Form đang trống");
    if (checkedBoxes.length === 0) throw new Error("Role không được bỏ trống");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_LOCAL_API_URL}/admin`,
        {
          ...formData,
          roleId: checkedBoxes,
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
      alert(error);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden transform transition-all duration-300 ease-in-out">
        <div className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">Thêm nhân viên mới</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên nhân viên
          </label>
          <input
            type="text"
            required
            onChange={(e) =>
              setFormData({ ...formData, nameAdmin: e.target.value })
            }
          />
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tài khoản nhân viên
          </label>
          <input
            type="text"
            required
            onChange={(e) =>
              setFormData({ ...formData, userName: e.target.value })
            }
          />
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu nhân viên
          </label>
          <input
            type="password"
            required
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <div>
            {roles &&
              roles.map((role) => (
                <div key={role._id}>
                  <input
                    onChange={handleCheckboxChange}
                    type="checkbox"
                    name={role.name}
                    value={role._id}
                  />
                  <label htmlFor={`${role.name}`}>{role.name}</label>
                </div>
              ))}
          </div>
          <button type="submit">Thêm</button>
        </form>
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 font-semibold transition-all duration-300 ease-in-out"
            // disabled={isSubmitting}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStaffModal;
