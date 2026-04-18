import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const sendOtpApi = async (emailId) => {
    try {
        const response = await axios.post(`${API_URL}/sendOTP`, {
            emailId: emailId
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const verifyOtpApi = async (emailId, otp) => {
    try {
        const response = await axios.put(`${API_URL}/verifyOTP`, {
            emailId: emailId,
            otp: otp
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
