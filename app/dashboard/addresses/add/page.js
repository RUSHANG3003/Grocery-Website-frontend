'use client';

import React, { useState } from "react";
import { ArrowLeft, Home, Briefcase, Map, Save, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { addAddress } from "../../../services/addressServices";

export default function AddAddressPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [formData, setFormData] = useState({
        address_type: "Home",
        full_address: "",
        landmark: "",
        city: "",
        state: "Maharashtra",
        pincode: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = Number(localStorage.getItem('userId'));
        if (!userId) {
            router.push('/');
            return;
        }

        setIsLoading(true);
        try {
            // Map the UI type to the backend ENUM values: 'Home', 'office', 'other'
            let finalType = formData.address_type;
            if (finalType === "Work") finalType = "office";
            else if (finalType === "Other") finalType = "other";

            const payload = {
                addressType: finalType,
                fullAddress: formData.full_address,
                landmark: formData.landmark,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                userId: userId,
                createdBy: userId
            };

            const response = await addAddress(payload);
            if (response && response.status === true) {
                setShowSuccess(true);
                // Redirect after a clear success confirmation
                setTimeout(() => {
                    router.push('/dashboard/addresses');
                }, 2000);
            } else {
                alert(response?.message || "Failed to add address");
            }
        } catch (error) {
            console.error("Error adding address:", error);
            alert("Something went wrong while saving.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white md:bg-gray-50 flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white sticky top-0 z-40 border-b border-gray-100/50">
                <div className="max-w-xl mx-auto px-4 py-5 flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2.5 hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 rounded-xl transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-extrabold text-gray-900 tracking-tight">Add New Address</h1>
                </div>
            </header>

            <main className="flex-grow max-w-xl mx-auto w-full px-4 py-8 relative">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] md:shadow-2xl md:shadow-emerald-900/5 p-8 md:p-12 border border-gray-100"
                >
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        {/* Address Type Selection */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-emerald-600/50 uppercase tracking-[0.2em] ml-1">Location Type</label>
                            <div className="flex gap-4">
                                {[
                                    { id: "Home", icon: Home, label: "Home" },
                                    { id: "Work", icon: Briefcase, label: "Office" },
                                    { id: "Other", icon: Map, label: "Other" }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, address_type: item.id })}
                                        className={`flex-1 py-5 rounded-[1.8rem] flex flex-col items-center gap-2 border-2 transition-all ${formData.address_type === item.id
                                            ? "bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-200"
                                            : "bg-gray-50 border-gray-50 text-gray-400 hover:border-emerald-100"
                                            }`}
                                    >
                                        <item.icon size={22} className={formData.address_type === item.id ? "animate-bounce" : ""} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Full Address */}
                        <div className="space-y-2 group">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-emerald-600 transition-colors">Street / Building / Area</label>
                            <textarea
                                required
                                rows="3"
                                value={formData.full_address}
                                onChange={(e) => setFormData({ ...formData, full_address: e.target.value })}
                                className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-50 rounded-[1.8rem] focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-gray-800 text-sm resize-none"
                                placeholder="House No. 12, Green Park Society..."
                            />
                        </div>

                        {/* Landmark */}
                        <div className="space-y-2 group">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-emerald-600 transition-colors">Landmark (Optional)</label>
                            <input
                                type="text"
                                value={formData.landmark}
                                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                                className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-50 rounded-[1.8rem] focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-gray-800 text-sm"
                                placeholder="Near City Mall"
                            />
                        </div>

                        {/* City & Pincode */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-emerald-600 transition-colors">City</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-50 rounded-[1.8rem] focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-gray-800 text-sm"
                                    placeholder="Mumbai"
                                />
                            </div>
                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-emerald-600 transition-colors">Pincode</label>
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    value={formData.pincode}
                                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                                    className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-50 rounded-[1.8rem] focus:bg-white focus:border-emerald-500 outline-none transition-all font-black text-gray-800 tracking-widest text-sm"
                                    placeholder="400001"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isLoading || showSuccess}
                                className={`w-full py-6 rounded-[2rem] font-black text-white transition-all flex items-center justify-center gap-3 ${showSuccess
                                    ? "bg-emerald-500 shadow-2xl shadow-emerald-200"
                                    : "bg-gray-900 hover:bg-emerald-600 shadow-2xl shadow-gray-200 hover:-translate-y-1 active:scale-95"
                                    } disabled:opacity-70`}
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : showSuccess ? (
                                    <>
                                        <CheckCircle2 size={24} className="animate-bounce" />
                                        <span>SUCCESSFULLY SAVED!</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        <span>SAVE ADDRESS</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>

                {/* Success Overlay */}
                <AnimatePresence>
                    {showSuccess && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8"
                        >
                            <motion.div
                                initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
                                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                transition={{ type: "spring", damping: 12, stiffness: 200 }}
                                className="w-40 h-40 bg-emerald-500 text-white rounded-[3rem] flex items-center justify-center shadow-2xl shadow-emerald-200 mb-8"
                            >
                                <CheckCircle2 size={80} strokeWidth={3} />
                            </motion.div>
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl font-black text-gray-900 mb-2 tracking-tight"
                            >
                                Address Added!
                            </motion.h2>

                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
