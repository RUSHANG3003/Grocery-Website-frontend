import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const generateRazorpayOrder = async (orderData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/generate-razorpay-order`, orderData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
