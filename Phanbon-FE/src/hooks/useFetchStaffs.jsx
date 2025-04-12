import axios from "axios";
import React, { useEffect, useState } from "react";

const useFetchStaffs = () => {
  const [staffs, setStaffs] = useState();
  const accessToken = window.localStorage.getItem("accessToken");

  useEffect(() => {
    const controller = new AbortController();
    const fetchStaffs = async () => {
      const result = await axios.get(
        `${import.meta.env.VITE_LOCAL_API_URL}/admin`,
        {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setStaffs(result.data);
    };
    fetchStaffs();
    return () => {
      controller.abort();
    };
  }, []);

  return staffs;
};

export default useFetchStaffs;
