import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useFetchCategories = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCategories = useCallback(async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get(`${import.meta.env.VITE_LOCAL_API_URL}/category`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setCategories(response.data.categories);
            setIsLoading(false);
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const updateCategory = useCallback(async (updatedCategory) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const { _id, categoryName, status } = updatedCategory;
            const response = await axios.put(
                `${import.meta.env.VITE_LOCAL_API_URL}/category/${_id}`,
                { categoryName, status },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                setCategories(prevCategories => 
                    prevCategories.map(cat => 
                        cat._id === _id ? { ...cat, ...response.data } : cat
                    )
                );
                console.log("Danh mục đã được cập nhật thành công");
            } else {
                throw new Error("Cập nhật không thành công");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật danh mục:", error.response?.data || error.message);
            throw error;
        }
    }, []);

    return { categories, isLoading, error, updateCategory, fetchCategories };
};

export default useFetchCategories;
