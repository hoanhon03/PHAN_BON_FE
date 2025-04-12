import { useState, useEffect } from "react";
import axios from "axios";
const useFetchReceiveDebt = () => {
  const [receiveDebt, setReceiveDebt] = useState();
  const accessToken = window.localStorage.getItem("accessToken");
  useEffect(() => {
    const controller = new AbortController();
    const fetchReceiveDebt = async () => {
      const result = await axios.get(
        `${import.meta.env.VITE_LOCAL_API_URL}/receivable`,
        {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setReceiveDebt(result.data.invoices);
    };
    fetchReceiveDebt();
    return () => {
      controller.abort();
    };
  }, []);

  return receiveDebt;
};

export default useFetchReceiveDebt;
