'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, ShoppingBag, ShoppingBasket, Lock } from 'lucide-react';
import { sendOtpApi, verifyOtpApi } from '../app/services/loginServices';

const LoginPage = () => {
    const [showSplash, setShowSplash] = useState(true);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 2500); // Splash duration

        return () => clearTimeout(timer);
    }, []);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailRegex.test(email)) {
            try {
                const response = await sendOtpApi(email);
                console.log("Send OTP Response:", response);

                // Based on screenshot: { "status": true, "data": { ... } }
                if (response && response.status === true) {
                    setShowOtpInput(true);
                    alert(response.data?.message || 'OTP sent successfully to your email');
                } else {
                    alert('Failed to send OTP. Please try again.');
                }
            } catch (error) {
                console.error("Error sending OTP:", error);
                alert('Failed to send OTP. Please try again.');
            } finally {
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
            alert('Please enter a valid email address');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {

            const response = await verifyOtpApi(email, otp);
            console.log("Verify Response:", response);

            // Based on previous screenshot: { "status": true, "data": { "token": "...", "userId": 1, ... } }
            if (response && response.status === true && response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                if (response.data.userId) {
                    localStorage.setItem('userId', response.data.userId);
                }

                // Admin & Delivery Detection 
                const role = response.data.role;
                localStorage.setItem('role', role);

                if (role === 'ADMIN') {
                    router.push('/admin');
                } else if (role === 'DELIVERY') {
                    router.push('/delivery/orders');
                } else {
                    router.push('/dashboard');
                }
            } else {
                console.error("Token missing in response:", response);
                alert('Verification successful but no token received.');
                setIsLoading(false);
            }

        } catch (error) {
            console.error("Error verifying OTP:", error);
            setIsLoading(false);
            alert('Invalid OTP or verification failed.');
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-white">
            <AnimatePresence mode="wait">
                {showSplash ? (
                    <motion.div
                        key="splash"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 text-white"
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                                duration: 1.5
                            }}
                            className="flex flex-col items-center"
                        >
                            <div className="rounded-full bg-white/20 p-6 backdrop-blur-sm shadow-xl">
                                <ShoppingBasket size={64} className="text-white drop-shadow-md" />
                            </div>

                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="mt-6 text-5xl font-extrabold tracking-tight drop-shadow-sm"
                            >
                                GROCERY
                                <span className="text-emerald-100 font-light">APP</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2, duration: 0.8 }}
                                className="mt-2 text-lg font-medium text-emerald-50 tracking-wide"
                            >
                                Freshness Delivered Daily
                            </motion.p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5, duration: 1 }}
                            className="absolute bottom-10"
                        >
                            <div className="h-1.5 w-12 rounded-full bg-white/30 overflow-hidden">
                                <motion.div
                                    className="h-full bg-white rounded-full"
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '100%' }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="login"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="flex min-h-screen w-full"
                    >
                        {/* Right Side - Image/Decoration (Hidden on small screens) */}
                        <div className="hidden lg:flex lg:w-1/2 relative bg-emerald-600 items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
                            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/60 to-transparent"></div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.8 }}
                                className="z-10 text-center text-white p-12"
                            >
                                <div className="flex justify-center mb-6">
                                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                                        <ShoppingBag size={48} />
                                    </div>
                                </div>
                                <h1 className="text-4xl font-bold mb-4">Shop Smart, Eat Fresh</h1>
                                <p className="text-emerald-100 text-lg max-w-md mx-auto">
                                    Get the best quality groceries delivered right to your doorstep within minutes.
                                </p>
                            </motion.div>

                            {/* Decorative Circles */}
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                                transition={{ repeat: Infinity, duration: 5 }}
                                className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-400 rounded-full blur-3xl opacity-30"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                                transition={{ repeat: Infinity, duration: 7 }}
                                className="absolute -top-24 -right-24 w-80 h-80 bg-teal-300 rounded-full blur-3xl opacity-20"
                            />
                        </div>

                        {/* Left Side - Login Form */}
                        <div className="flex w-full lg:w-1/2 flex-col justify-center px-6 py-12 lg:px-16 xl:px-24 bg-gray-50 lg:bg-white relative">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="w-full max-w-md mx-auto"
                            >
                                <div className="mb-10 text-center lg:text-left">
                                    <div className="inline-flex lg:hidden items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 mb-4">
                                        <ShoppingBag size={24} />
                                    </div>
                                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome Back</h2>
                                    <p className="mt-2 text-sm text-gray-600">
                                        {showOtpInput ? 'Enter the OTP sent to your email' : 'Enter your email to access your account'}
                                    </p>
                                </div>

                                <form onSubmit={showOtpInput ? handleVerifyOtp : handleSendOtp} className="space-y-6">
                                    {!showOtpInput ? (
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                                                Email Address
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                                                    <Mail size={20} />
                                                </div>
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    autoComplete="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="block w-full rounded-xl border-0 py-3.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 transition-all bg-white"
                                                    placeholder="Enter your email"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <label htmlFor="otp" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                                                One-Time Password
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                                                    <Lock size={20} />
                                                </div>
                                                <input
                                                    id="otp"
                                                    name="otp"
                                                    type="text"
                                                    maxLength="6"
                                                    required
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    className="block w-full rounded-xl border-0 py-3.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 transition-all bg-white tracking-widest"
                                                    placeholder="• • • • • •"
                                                />
                                            </div>
                                            <div className="mt-2 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowOtpInput(false)}
                                                    className="text-xs text-emerald-600 hover:text-emerald-500 font-medium"
                                                >
                                                    Change Email?
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex w-full justify-center items-center gap-2 rounded-xl bg-emerald-600 px-3 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-500 hover:shadow-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? (
                                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            ) : (
                                                <>
                                                    {showOtpInput ? 'Verify & Login' : 'Send OTP'} <ArrowRight size={18} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>

                                <div className="mt-8 text-center text-xs text-gray-400">
                                    By continuing, you agree to our <a href="#" className="underline hover:text-emerald-600">Terms of Service</a> and <a href="#" className="underline hover:text-emerald-600">Privacy Policy</a>
                                </div>
                            </motion.div>

                            {/* Decoration for mobile */}
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl lg:hidden"></div>
                            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl lg:hidden"></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LoginPage;
