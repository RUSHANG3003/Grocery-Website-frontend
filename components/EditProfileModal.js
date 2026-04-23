'use client';

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, Mail, Save, Loader2 } from "lucide-react";
import { getUserProfile, updateUser } from "../app/services/userServices";
import toast from "react-hot-toast";

export default function EditProfileModal({ isOpen, onClose, userId }) {
    const [profileData, setProfileData] = useState({
        userId: "",
        userName: "",
        emailId: "",
        mobileNumber: "",
        updatedBy: ""
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && userId) {
            handleFetchProfile(userId);
        }
    }, [isOpen, userId]);

    const handleFetchProfile = async (uid) => {
        try {
            setIsLoading(true);
            const response = await getUserProfile(uid);
            if (response && response.status === true) {
                setProfileData(response.data.user);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            toast.error("Failed to load profile details");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(profileData.mobileNumber)) {
            toast.error("Please enter a valid 10-digit mobile number.");
            return;
        }

        setIsUpdating(true);
        try {
            const { emailId, userId: pUserId, ...otherFields } = profileData;
            const updatePayload = {
                ...otherFields,
                userId: Number(pUserId),
                updatedBy: Number(pUserId)
            };

            const response = await updateUser(updatePayload);
            if (response && response.status === true) {
                toast.success("Profile updated successfully! ✨", {
                    style: {
                        borderRadius: '16px',
                        background: '#10b981',
                        color: '#fff',
                        fontWeight: 'bold'
                    }
                });
                onClose();
            } else {
                toast.error(response?.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Error updating profile");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-2xl transition-colors"
                        >
                            <X size={20} className="text-gray-400" />
                        </button>

                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Edit Profile</h2>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Manage your details</p>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                            </div>
                        ) : (
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={profileData.userName}
                                            onChange={(e) => setProfileData({ ...profileData, userName: e.target.value })}
                                            className="block w-full rounded-2xl border-gray-100 py-4 pl-12 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none border font-bold text-gray-900"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            readOnly
                                            value={profileData.emailId}
                                            className="block w-full rounded-2xl border-gray-100 py-4 pl-12 bg-gray-50/50 text-gray-400 cursor-not-allowed outline-none border font-bold"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Mobile Number</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                                            <Phone size={18} />
                                        </div>
                                        <input
                                            type="tel"
                                            required
                                            maxLength={10}
                                            pattern="[0-9]{10}"
                                            value={profileData.mobileNumber}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                if (val.length <= 10) {
                                                    setProfileData({ ...profileData, mobileNumber: val });
                                                }
                                            }}
                                            className="block w-full rounded-2xl border-gray-100 py-4 pl-12 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none border font-bold text-gray-900"
                                            placeholder="10-digit mobile number"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-gray-200 hover:bg-emerald-600 active:scale-[0.98] transition-all disabled:opacity-70 mt-4"
                                >
                                    {isUpdating ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            Update Profile
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
