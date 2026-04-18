'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Home, Briefcase, Map, Plus, ChevronRight, Check } from 'lucide-react';
import { getAllAddressByUserId } from '../app/services/addressServices';
import { useRouter } from 'next/navigation';

export default function AddressSelectionModal({ isOpen, onClose, onSelect, selectedAddressId }) {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            fetchAddresses();
        }
    }, [isOpen]);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            const response = await getAllAddressByUserId(userId);
            if (response && response.status === true) {
                const addressData = Array.isArray(response.data)
                    ? response.data
                    : (response.data?.addresses || []);
                setAddresses(addressData);
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        } finally {
            setLoading(false);
        }
    };

    const getAddressIcon = (type) => {
        const lowerType = (type || "").toLowerCase();
        if (lowerType === "home") return <Home size={20} />;
        if (lowerType === "office" || lowerType === "work") return <Briefcase size={20} />;
        return <Map size={20} />;
    };

    const getIconBgColor = (type) => {
        const lowerType = (type || "").toLowerCase();
        if (lowerType === "home") return "bg-blue-50 text-blue-500";
        if (lowerType === "office" || lowerType === "work") return "bg-orange-50 text-orange-500";
        return "bg-emerald-50 text-emerald-500";
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-white rounded-t-[3rem] z-[101] overflow-hidden shadow-2xl"
                        style={{ maxHeight: "85vh" }}
                    >
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-black text-gray-900">Select Delivery Address</h2>
                            <button
                                onClick={onClose}
                                className="p-2 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(85vh - 80px)" }}>
                            {/* Add New Address Button */}
                            <button
                                onClick={() => router.push('/dashboard/addresses/add')}
                                className="w-full flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mb-6 group hover:bg-emerald-600 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                        <Plus size={20} />
                                    </div>
                                    <span className="font-bold text-emerald-700 group-hover:text-white">Add New Address</span>
                                </div>
                                <ChevronRight size={18} className="text-emerald-300 group-hover:text-white" />
                            </button>

                            {loading ? (
                                <div className="flex justify-center py-10">
                                    <div className="w-8 h-8 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                                </div>
                            ) : addresses.length === 0 ? (
                                <div className="text-center py-10">
                                    <MapPin size={40} className="mx-auto text-gray-200 mb-4" />
                                    <p className="text-gray-500 font-bold">No saved addresses found</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {addresses.map((address) => {
                                        const isSelected = (address.address_id_pk || address.addressId) === selectedAddressId;
                                        return (
                                            <motion.div
                                                key={address.address_id_pk || address.addressId}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    onSelect(address);
                                                    onClose();
                                                }}
                                                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${isSelected
                                                        ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/10'
                                                        : 'border-gray-100 hover:border-emerald-200'
                                                    }`}
                                            >
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getIconBgColor(address.address_type || address.addressType)}`}>
                                                    {getAddressIcon(address.address_type || address.addressType)}
                                                </div>
                                                <div className="flex-grow min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-black text-gray-900 capitalize text-sm">{address.address_type || address.addressType}</span>
                                                        {isSelected && (
                                                            <div className="bg-emerald-500 text-white rounded-full p-0.5">
                                                                <Check size={10} strokeWidth={4} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed">
                                                        {address.full_address || address.fullAddress}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tight">
                                                        {address.city} • {address.pincode}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
