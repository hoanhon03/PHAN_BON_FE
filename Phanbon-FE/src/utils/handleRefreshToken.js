import axios from "axios";

export const handleRefreshToken = async (refreshToken) => {
  if (refreshToken === "") {
    console.error("Token bị rỗng");
    return;
  }
  const result = await axios.patch(
    `${import.meta.env.VITE_LOCAL_API_URL}/auth/refresh-token`,
    {
      refreshToken,
    }
  );
  if (!result) {
    console.error("Token bị lỗi");
    return;
  }
  return result.data.refreshToken;
};
