import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const getCartByUserId = async (userId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/getCartByUserId?userId=${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }

};

export const addToCart = async (userId, productId, quantity) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/addToCart`, {
            userId,
            productId,
            quantity
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateCart = async (cartItemId, quantity, updatedBy) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/updateCartItem`, {
            cartItemId,
            quantity,
            updatedBy
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteCartItem = async (cartItemId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/deleteCartItem?cartItemId=${cartItemId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },

        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

