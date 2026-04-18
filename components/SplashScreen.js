'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBasket } from 'lucide-react';

const SplashScreen = ({ onFinish }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2500); // Show for 2.5 seconds

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence onExitComplete={onFinish}>
            {isVisible && (
                <motion.div
                    key="splash"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
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
            )}
        </AnimatePresence>
    );
};

export default SplashScreen;
