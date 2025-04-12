import axios from "axios";
import React, { useEffect, useState } from "react";

const useFetchRoles = () => {
  const [roles, setRoles] = useState();
  const accessToken = window.localStorage.getItem("accessToken");

  useEffect(() => {
    const controller = new AbortController();
    const fetchRoles = async () => {
      const result = await axios.get(
        `${import.meta.env.VITE_LOCAL_API_URL}/role`,
        {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setRoles(result.data.data);
    };
    fetchRoles();
    return () => {
      controller.abort();
    };
  }, []);

  return roles;
};

export default useFetchRoles;
