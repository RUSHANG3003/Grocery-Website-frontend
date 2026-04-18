import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const getProductsByCategoryId = async (categoryId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/getProductsByCategoryId?categoryId=${categoryId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addProduct = async (formData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/AddProduct`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const updateProduct = async (formData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/updateProduct`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getProductById = async (productId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/getProductById?productId=${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteProduct = async (productId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/deleteProduct?productId=${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


