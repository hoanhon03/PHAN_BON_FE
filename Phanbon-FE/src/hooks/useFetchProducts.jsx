import { useState, useEffect } from "react";
import axios from "axios";

const useFetchProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    const accessToken = window.localStorage.getItem("accessToken");

    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_LOCAL_API_URL}/products`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setProducts(response.data.products);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateProduct = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      )
    );
  };

  return { products, isLoading, error, fetchProducts, updateProduct };
};

export default useFetchProducts;
