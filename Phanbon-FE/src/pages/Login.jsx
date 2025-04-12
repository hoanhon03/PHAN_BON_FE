import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const navigate = useNavigate();

  if (localStorage.getItem("refreshToken") !== null) {
    window.location.href = "/";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Đang gửi yêu cầu đăng nhập...");
      const result = await axios.post(
        `${import.meta.env.VITE_LOCAL_API_URL}/auth/login`,
        {
          account: formData.username,
          password: formData.password,
        }
      );
      console.log("Kết quả đăng nhập:", result);
      if (result.status === 200) {
        localStorage.setItem("refreshToken", result.data.data.refreshToken);
        localStorage.setItem("accessToken", result.data.data.access_token);
        localStorage.setItem("userId", result.data.data.user._id);
        localStorage.setItem("username", formData.username);
        alert("Đăng nhập thành công");
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      alert("Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <main className="bg-[url('./assets/BG-Login.png')] w-screen h-screen bg-cover bg-no-repeat bg-center flex items-center justify-center">
      <div className="bg-white bg-opacity-90 p-10 rounded-3xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-green-500 text-center mb-8">ADMIN LOGIN</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-green-600 mb-2">
              Username
            </label>
            <input
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              type="text"
              name="username"
              id="username"
              placeholder="Enter username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-green-600 mb-2">
              Password
            </label>
            <input
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Enter password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-green-600"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mt-6"
          >
            Log in
          </button>
        </form>

      </div>
    </main>
  );
};

export default Login;