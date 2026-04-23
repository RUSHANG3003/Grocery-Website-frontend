'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, CheckCircle, Search, MapPin, Loader2, Navigation, LogOut, ArrowLeft } from 'lucide-react';
import { getAssignedOrders, updateOrderStatus } from '@/app/services/orderServices';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import EditProfileModal from '@/components/EditProfileModal';
import { User } from 'lucide-react';

export default function DeliveryOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [userId, setUserId] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const role = localStorage.getItem('role');
        const id = localStorage.getItem('userId');
        
        if (role !== 'DELIVERY' && role !== 'ADMIN') {
            router.push('/');
            return;
        }
        
        setUserId(id);
        fetchAssignedOrders();
    }, []);

    const fetchAssignedOrders = async () => {
        try {
            setLoading(true);
            const currentUserId = localStorage.getItem('userId');
            const response = await getAssignedOrders(currentUserId);

            if (response && response.status && response.data && response.data.assignedOrders) {
                const assignedOrders = response.data.assignedOrders.map(order => ({
                    orderId: String(order.orderId),
                    totalAmount: parseFloat(order.totalAmount) || 0,
                    orderStatus: order.orderStatus,
                    date: new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
                    addressType: order.addressType,
                    fullAddress: order.fullAddress,
                    city: order.city,
                    state: order.state,
                    pincode: order.pincode,
                    customerName: order.customerName || 'Customer'
                }));

                setOrders(assignedOrders);
            }
        } catch (error) {
            console.error("Failed fetching assigned orders:", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkDelivered = async (orderId) => {
        const userId = localStorage.getItem('userId');

        try {
            const payload = {
                orderId: parseInt(orderId),
                status: 'DELIVERED',
                updatedBy: userId
            };

            await updateOrderStatus(payload);
            toast.success("Order marked as delivered! 🎉", {
                icon: '🚚',
                style: {
                    borderRadius: '16px',
                    background: '#10b981',
                    color: '#fff',
                    fontWeight: 'bold'
                }
            });
            fetchAssignedOrders(); // Refresh list
        } catch (err) {
            console.error("Failed updating order status:", err);
            toast.error("Failed to update order");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push('/');
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen w-full bg-white">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360]
                    }} 
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <Truck size={48} className="text-emerald-500" />
                </motion.div>
                <p className="mt-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] animate-pulse">Scanning Assignments</p>
            </div>
        );
    }

    const pendingOrders = orders.filter(o => o.orderStatus !== 'DELIVERED');
    const completedOrders = orders.filter(o => o.orderStatus === 'DELIVERED');

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 font-sans">
            {/* Premium Header */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
                <div className="max-w-2xl mx-auto px-6 py-5 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <h1 className="text-lg font-black text-gray-900 tracking-tight">Delivery Hub</h1>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {pendingOrders.length} Active Tasks
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setShowProfileModal(true)}
                            className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-emerald-50 hover:text-emerald-500 transition-all active:scale-90"
                            title="Edit Profile"
                        >
                            <User size={18} />
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <EditProfileModal 
                isOpen={showProfileModal} 
                onClose={() => setShowProfileModal(false)} 
                userId={userId} 
            />

            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Active Assignments Section */}
                <div className="mb-10">
                    <h2 className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <div className="w-4 h-[1px] bg-gray-200" /> Active Shipments
                    </h2>
                    
                    <div className="space-y-6">
                        <AnimatePresence mode="popLayout">
                            {pendingOrders.map((order) => (
                                <motion.div
                                    key={order.orderId}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, x: 100 }}
                                    className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative group"
                                >
                                    <div className="p-7">
                                        <div className="flex justify-between items-center mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                                    <Package size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</p>
                                                    <p className="text-sm font-black text-gray-900">#{order.orderId}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</p>
                                                <p className="text-lg font-black text-emerald-600 tracking-tight">₹{order.totalAmount.toFixed(0)}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <div className="flex gap-4">
                                                <div className="flex flex-col items-center gap-1 mt-1">
                                                    <div className="w-2.5 h-2.5 rounded-full border-2 border-emerald-500 bg-white" />
                                                    <div className="w-[2px] h-10 bg-gray-100 rounded-full" />
                                                    <MapPin size={14} className="text-emerald-500" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pickup</p>
                                                    <p className="text-xs font-bold text-gray-600">Main Warehouse • Hub A</p>
                                                    
                                                    <div className="mt-4">
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Drop-off • <span className="text-blue-500">{order.addressType}</span></p>
                                                        <p className="text-sm font-bold text-gray-900 leading-snug">
                                                            {order.fullAddress}
                                                        </p>
                                                        <p className="text-xs font-medium text-gray-500 mt-1">
                                                            {order.city}, {order.state} - {order.pincode}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleMarkDelivered(order.orderId)}
                                            className="w-full py-4 rounded-[1.5rem] bg-gray-900 text-white font-black text-[10px] uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-gray-200"
                                        >
                                            <CheckCircle size={16} /> Confirm Delivery
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {pendingOrders.length === 0 && (
                            <div className="bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-gray-100">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="text-gray-200" size={32} />
                                </div>
                                <h3 className="text-sm font-black text-gray-900">All caught up!</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">No pending deliveries for you.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* History Section */}
                {completedOrders.length > 0 && (
                    <div className="mt-12 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        <h2 className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <div className="w-4 h-[1px] bg-gray-200" /> Completed Recently
                        </h2>
                        <div className="space-y-3">
                            {completedOrders.slice(0, 3).map((order) => (
                                <div key={order.orderId} className="bg-white/50 p-4 rounded-3xl border border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                            <CheckCircle size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-900">Order #{order.orderId}</p>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase">{order.date}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs font-black text-gray-900">₹{order.totalAmount}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
