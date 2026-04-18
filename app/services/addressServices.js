import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const addAddress = async (addressData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/addAddress`, addressData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const updateAddress = async (addressData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/updateAddress`, addressData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllAddressByUserId = async (userId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/getAllAddressByUserId?userId=${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAddressById = async (addressId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/getAddressById?addressId=${addressId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteAddressById = async (addressId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/deleteAddressById?addressId=${addressId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
