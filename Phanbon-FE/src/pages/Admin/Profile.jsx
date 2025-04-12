import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useFetchAdmins from "../../hooks/useFetchAdmins";
import axios from "axios";

const Profile = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState();
  const listAdmins = useFetchAdmins();
  if (!listAdmins) return <div>Đang tải</div>;
  const admin = listAdmins.find((ad) => ad._id === id);
  const accessToken = localStorage.getItem("accessToken");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData) {
      alert("Form đang bị rỗng");
      return;
    }
    const roles = admin.role.map((role) => role._id);

    if (formData.password && formData.password === "") {
      alert("Password không được rỗng");
      return;
    }
    if (formData.nameAdmin === "" || formData.nameAdmin === admin.nameAdmin) {
      alert("Admin name không được trùng hoặc bỏ trống");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_LOCAL_API_URL}/admin`,
        { ...formData, roleId: roles, id: admin._id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        localStorage.setItem("username", formData.nameAdmin);
        alert("Chỉnh sửa thành công!");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main>
      <h1>{`THÔNG TIN CÁ NHÂN CỦA ${admin.adminId}`}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Id: </label>
          <span>{`${admin.adminId}`}</span>
        </div>
        <div>
          <label>Username: </label>
          <span>{`${admin.userName}`}</span>
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
        <div>
          <label>Name: </label>
          <input
            type="text"
            onChange={(e) =>
              setFormData({ ...formData, nameAdmin: e.target.value })
            }
            defaultValue={admin.nameAdmin}
          />
        </div>

        <button className="p-2 bg-green-500" type="submit">
          Chỉnh sửa
        </button>
      </form>
    </main>
  );
};

export default Profile;
