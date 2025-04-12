import axios from "axios";
import React, { useEffect, useState } from "react";

const useFetchPayDebt = () => {
  const [payDebt, setPayDebt] = useState();
  const accessToken = window.localStorage.getItem("accessToken");
  useEffect(() => {
    const controller = new AbortController();
    const fetchPayDebt = async () => {
      const result = await axios.get(
        `${import.meta.env.VITE_LOCAL_API_URL}/payable`,
        {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setPayDebt(result.data);
    };
    fetchPayDebt();
    return () => {
      controller.abort();
    };
  }, []);

  return payDebt;
};

export default useFetchPayDebt;
