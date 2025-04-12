import axios from "axios";
import React, { useEffect, useState } from "react";

const useFetchCustomers = () => {
  const [customers, setCustomers] = useState();
  const accessToken = localStorage.getItem("accessToken");
  const controller = new AbortController();
  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_LOCAL_API_URL}/user`,
        {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setCustomers(response.data);
    };
    fetchCustomers();
    return () => {
      controller.abort();
    };
  }, []);

  return customers;
};

export default useFetchCustomers;
