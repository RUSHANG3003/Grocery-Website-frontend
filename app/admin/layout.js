'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    LogOut,
    Menu,
    X,
    Bell,
    ChevronDown,
    User,
    Mail,
    Phone,
    Save,
    Layers
} from 'lucide-react';
import { getUserProfile, updateUser } from '@/app/services/userServices';

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleFetchProfile = async (userId) => {
        try {
            const response = await getUserProfile(userId);

            if (response && response.status === true) {
                setProfileData({ ...response.data.user, userId });
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setMounted(true);
        // Quick role check 
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token) {
            router.push('/');
        } else if (userId) {
            handleFetchProfile(userId);
        }
    }, [router]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(profileData?.mobileNumber || profileData?.mobile)) {
            alert("Please enter a valid 10-digit mobile number.");
            return;
        }

        setIsUpdating(true);

        try {
            const { emailId, userId, ...otherFields } = profileData;
            const updatePayload = {
                ...otherFields,
                userId: Number(userId),
                updatedBy: Number(userId)
            };

            const response = await updateUser(updatePayload);
            if (response && response.status === true) {
                alert("Profile updated successfully!");
                setShowProfileModal(false);
            } else {
                alert(response?.message || "Failed to update profile. Please try again.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            const backendMessage = error.response?.data?.message;
            const statusText = error.response?.statusText;
            const errorMessage = backendMessage || statusText || error.message || "Error updating profile.";
            alert(`Update Error: ${errorMessage}`);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push('/');
    };

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
        { name: 'Orders', href: '/admin/orders', icon: <ShoppingCart size={20} /> },
        { name: 'Categories', href: '/admin/categories', icon: <Layers size={20} /> },
    ];

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#F5F7FD] flex font-sans">
            {/* Background Blur Overlay when modal is active */}
            {showProfileModal && (
                <div className="fixed inset-0 z-[55] bg-white/20 backdrop-blur-md pointer-events-none" />
            )}

            {/* Profile Update Modal */}
            <AnimatePresence>
                {showProfileModal && profileData && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowProfileModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8"
                        >
                            <button
                                onClick={() => setShowProfileModal(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} className="text-gray-400" />
                            </button>

                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Admin Profile</h2>
                                <p className="text-gray-500 text-sm mt-1">Review or update your details</p>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600">
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={profileData.userName || profileData.fullName || profileData.name || ''}
                                            onChange={(e) => setProfileData({ ...profileData, userName: e.target.value, fullName: e.target.value })}
                                            className="block w-full rounded-xl border-gray-200 py-3 pl-10 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none border"
                                            placeholder="Enter your name"
                                        />
                                    </div><br />
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email ID</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600">
                                                <Mail size={18} />
                                            </div>
                                            <input
                                                type="email"
                                                required
                                                value={profileData.emailId || ''}
                                                onChange={(e) => setProfileData({ ...profileData, emailId: e.target.value })}
                                                className="block w-full rounded-xl border-gray-200 py-3 pl-10 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none border cursor-not-allowed opacity-70"
                                                placeholder="Enter your email"
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600">
                                            <Phone size={18} />
                                        </div>
                                        <input
                                            type="tel"
                                            required
                                            maxLength={10}
                                            pattern="[0-9]{10}"
                                            value={profileData.mobileNumber || profileData.mobile || ''}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, ''); // Only numbers
                                                if (val.length <= 10) {
                                                    setProfileData({ ...profileData, mobileNumber: val, mobile: val });
                                                }
                                            }}
                                            className="block w-full rounded-xl border-gray-200 py-3 pl-10 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none border"
                                            placeholder="Enter 10-digit mobile number"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-500 active:scale-[0.98] transition-all disabled:opacity-70"
                                >
                                    {isUpdating ? (
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            Save Profile
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 shadow-sm fixed inset-y-0 z-20">
                <div className="p-6 flex items-center justify-center border-b border-gray-50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
                            <Package className="text-white" size={16} />
                        </div>
                        <h2 className="text-xl font-black text-gray-900 tracking-tight">Grocery<span className="text-emerald-600">Admin</span></h2>
                    </div>
                </div>

                <div className="flex-1 py-6 px-4 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || (item.name !== 'Dashboard' && pathname.startsWith(item.href));
                        return (
                            <Link key={item.name} href={item.href}>
                                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer font-bold text-sm ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
                                    <div className={isActive ? 'text-emerald-600' : 'text-gray-400'}>
                                        {item.icon}
                                    </div>
                                    {item.name}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-gray-50">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 w-full transition-all text-sm font-bold">
                        <LogOut size={20} />
                        <span className="text-red-600">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                            className="fixed inset-y-0 left-0 w-64 bg-white shadow-2xl z-50 flex flex-col md:hidden"
                        >
                            <div className="p-6 flex items-center justify-between border-b border-gray-50">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center">
                                        <Package className="text-white" size={16} />
                                    </div>
                                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Admin</h2>
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400 bg-gray-50 rounded-full hover:text-gray-900">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 py-6 px-4 space-y-2">
                                {navigation.map((item) => {
                                    const isActive = pathname === item.href || (item.name !== 'Dashboard' && pathname.startsWith(item.href));
                                    return (
                                        <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer font-bold text-sm ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
                                                <div className={isActive ? 'text-emerald-600' : 'text-gray-400'}>{item.icon}</div>
                                                {item.name}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 md:pl-64 flex flex-col min-h-screen">

                {/* Top Header */}
                <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-30 border-b border-gray-100 px-4 md:px-8 py-3 w-full flex items-center justify-between h-[72px]">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            <Menu size={20} />
                        </button>

                        {/* Page Title Contextual */}
                        <div className="hidden sm:block">
                            <h2 className="text-lg font-extrabold text-gray-800 tracking-tight">Admin Console</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* <button className="p-2.5 rounded-full bg-gray-50 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all relative">
                            <Bell size={18} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                        </button> */}

                        <div className="h-8 w-px bg-gray-200 mx-1"></div>

                        {/* Profile Dropdown logic */}
                        <div className="relative">
                            <div
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 cursor-pointer p-1.5 pr-3 rounded-full hover:bg-gray-50 transition-colors border border-transparent"
                            >
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
                                    <User size={16} />
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-[11px] font-bold text-gray-800 leading-none truncate max-w-[120px]">
                                        {profileData ? (profileData.fullName || profileData.userName || profileData.emailId) : 'Loading...'}
                                    </p>
                                    <p className="text-[10px] font-semibold text-gray-400 mt-0.5">
                                        {profileData ? (profileData.role_name || profileData.role || 'Admin') : 'Loading...'}
                                    </p>
                                </div>
                                <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
                            </div>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] border border-gray-100 py-2 z-50"
                                        >
                                            <div className="px-4 py-2 border-b border-gray-50 mb-2">
                                                <p className="text-xs font-bold text-gray-900">{profileData ? (profileData.fullName || profileData.name || 'Admin User') : 'Signed in as'}</p>
                                                <p className="text-xs text-gray-500 truncate mt-0.5">{profileData ? profileData.emailId : 'Loading...'}</p>
                                            </div>
                                            <div className="px-2 pb-2">
                                                <button
                                                    onClick={() => {
                                                        setShowProfileModal(true);
                                                        setIsProfileOpen(false);
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-sm font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                                                >
                                                    <User size={16} /> My Profile
                                                </button>
                                                <button onClick={handleLogout} className="w-full text-left px-3 py-2 mt-1 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2 transition-colors">
                                                    <LogOut size={16} /> Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Main Dynamic View */}
                <main className="flex-1 w-full bg-[#F5F7FD]">
                    {children}
                </main>
            </div>
        </div>
    );
}
