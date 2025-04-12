import { useState, useEffect } from "react";
import axios from "axios";
const useFetchPurchaseBill = () => {
  const [purchaseBill, setPurchaseBill] = useState();
  const accessToken = window.localStorage.getItem("accessToken");
  useEffect(() => {
    const controller = new AbortController();
    const fetchPurchaseBills = async () => {
      const result = await axios.get(
        `${import.meta.env.VITE_LOCAL_API_URL}/purchase-invoice`,
        {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setPurchaseBill(result.data);
    };
    fetchPurchaseBills();
    return () => {
      controller.abort();
    };
  }, []);

  return purchaseBill;
};

export default useFetchPurchaseBill;
