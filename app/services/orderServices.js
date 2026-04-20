import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const createOrder = async (orderData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/create-order`, orderData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }


};

export const getOrderHistory = async (userId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/GetOrderHistoryByUserId?userId=${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllAvailableOrders = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/getAvailabeOrders`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateOrderStatus = async (orderData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/updateOrderStatus`, orderData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
