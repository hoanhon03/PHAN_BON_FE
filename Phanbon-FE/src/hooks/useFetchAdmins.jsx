import axios from "axios";
import { useEffect, useState } from "react";

const useFetchAdmins = () => {
  const [admins, setAdmins] = useState();
  const accessToken = window.localStorage.getItem("accessToken");

  useEffect(() => {
    const controller = new AbortController();
    const fetchAdmins = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_LOCAL_API_URL}/admin`,
          {
            signal: controller.signal,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setAdmins(result.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Yêu cầu đã bị hủy:", error.message);
        }
      }
    };
    fetchAdmins();
    return () => {
      controller.abort();
    };
  }, []);

  return admins;
};

export default useFetchAdmins;
