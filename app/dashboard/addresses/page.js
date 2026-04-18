'use client';

import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus, MapPin, Edit2, Trash2, Home, Briefcase, Map, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getAllAddressByUserId, deleteAddressById } from "../../services/addressServices";


export default function AddressesPage() {
    const router = useRouter();
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            router.push('/');
            return;
        }
        fetchAddresses(userId);
    }, [router]);

    const fetchAddresses = async (userId) => {
        try {
            setIsLoading(true);
            const response = await getAllAddressByUserId(userId);
            console.log("Fetch Addresses Response:", response);

            if (response && response.status === true) {
                // Defensive check for array structure
                const addressData = Array.isArray(response.data)
                    ? response.data
                    : (response.data?.addresses || []);

                setAddresses(Array.isArray(addressData) ? addressData : []);
            } else {
                setAddresses([]);
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
            setAddresses([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (addressId) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            try {
                const response = await deleteAddressById(addressId);
                if (response && response.status === true) {
                    alert("Address deleted successfully!");
                    const userId = localStorage.getItem('userId');
                    fetchAddresses(userId);
                } else {
                    alert("Failed to delete address");
                }
            } catch (error) {
                console.error("Error deleting address:", error);
            }
        }
    };

    const handleSelectAddress = (address) => {
        const type = address.address_type || address.addressType || "Home";
        const fullAddress = address.full_address || address.fullAddress;

        // Pass address details via query parameters to avoid localStorage
        router.push(`/dashboard?type=${encodeURIComponent(type)}&address=${encodeURIComponent(fullAddress)}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="bg-white sticky top-0 z-40 border-b border-gray-100 shadow-sm">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ArrowLeft size={20} className="text-gray-700" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">Saved Addresses</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
                {/* Add New Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => router.push('/dashboard/addresses/add')}
                        className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                <Plus size={24} />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-gray-900">Add a new address</h3>
                                <p className="text-sm text-gray-500">Save for faster checkout next time</p>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
                    </button>
                </motion.div>

                <div className="flex items-center justify-between mb-6 px-1">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Your Saved Addresses</h2>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        {addresses.length} SAVED
                    </span>
                </div>

                {/* Address List */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                    </div>
                ) : addresses.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm"
                    >
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin size={40} className="text-gray-200" />
                        </div>
                        <h3 className="text-gray-900 font-bold text-xl">No saved addresses</h3>
                        <p className="text-gray-500 text-sm mt-2 max-w-[240px] mx-auto">Looks like you haven't added any addresses yet.</p>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {addresses.map((address, index) => (
                            <motion.div
                                key={address.address_id_pk || address.addressId || index}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-300 transition-all relative overflow-hidden group cursor-pointer active:scale-[0.98]"
                            >
                                <div
                                    className="p-6 flex items-start gap-5 relative z-10"
                                    onClick={() => handleSelectAddress(address)}
                                >
                                    <div className="flex-shrink-0">
                                        {(() => {
                                            const type = (address.address_type || address.addressType || "").toLowerCase();
                                            if (type === "home") {
                                                return (
                                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-500">
                                                        <Home size={28} />
                                                    </div>
                                                );
                                            } else if (type === "office" || type === "work") {
                                                return (
                                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-orange-50 text-orange-500">
                                                        <Briefcase size={28} />
                                                    </div>
                                                );
                                            } else {
                                                return (
                                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-emerald-50 text-emerald-500">
                                                        <Map size={28} />
                                                    </div>
                                                );
                                            }
                                        })()}
                                    </div>
                                    <div className="space-y-2 flex-grow min-w-0">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-extrabold text-gray-900 text-lg capitalize">{address.address_type || address.addressType}</h3>
                                            {address.isDefault && (
                                                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg font-black uppercase tracking-tighter">Default</span>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-gray-800 font-semibold text-sm leading-relaxed">
                                                {address.full_address}
                                            </p>
                                            <p className="text-gray-500 text-xs font-medium">
                                                {address.city}, {address.state} - <span className="text-gray-900">{address.pincode}</span>
                                            </p>
                                            {address.landmark && (
                                                <div className="flex items-center gap-1 mt-2 p-1.5 bg-gray-50 rounded-lg w-max">
                                                    <MapPin size={10} className="text-gray-400" />
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Near: {address.landmark}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/dashboard/addresses/edit?id=${address.address_id_pk || address.addressId}`);
                                            }}
                                            className="p-3 bg-gray-50 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all shadow-sm"
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(address.address_id_pk || address.addressId);
                                            }}
                                            className="p-3 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Hover background effect */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/20 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
