'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingCart, Package, IndianRupee, Clock, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

const SUMMARY_DATA = [
    {
        title: 'Total Revenue',
        value: '₹45,231.50',
        trend: '+12.5%',
        trendUp: true,
        icon: <IndianRupee size={24} />,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-100'
    },
    {
        title: 'Total Orders',
        value: '1,204',
        trend: '+5.2%',
        trendUp: true,
        icon: <ShoppingCart size={24} />,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-100'
    },
    {
        title: 'Pending Orders',
        value: '42',
        trend: '-2.1%',
        trendUp: false,
        icon: <Clock size={24} />,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-100'
    },
    {
        title: 'Delivered (Today)',
        value: '89',
        trend: '+18.2%',
        trendUp: true,
        icon: <Package size={24} />,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-100'
    }
];

export default function AdminDashboardPage() {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">Here is what is happening today</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-4 py-2.5 bg-white border border-gray-200 shadow-sm rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                        Export Report
                    </button>
                    <button className="px-4 py-2.5 bg-gray-900 shadow-lg shadow-gray-200 rounded-xl text-xs font-bold text-white hover:bg-black transition-colors flex items-center gap-2">
                        <Link href="http://localhost:3000">
                            View Live Store
                        </Link>
                    </button>
                </div>
            </div>

            {/* Summary Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {SUMMARY_DATA.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        className="bg-white rounded-[1.5rem] border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${card.bgColor} ${card.color} ${card.borderColor} group-hover:scale-110 duration-300`}>
                                {card.icon}
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-extrabold px-2 py-1 rounded-md ${card.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {card.trendUp ? <TrendingUp size={10} strokeWidth={3} /> : <TrendingDown size={10} strokeWidth={3} />}
                                {card.trend}
                            </div>
                        </div>

                        <div>
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">{card.title}</p>
                            <h3 className="text-3xl font-black text-gray-900 tracking-tight">{card.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Placeholder sections for expansion */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                {/* Recent Orders Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="lg:col-span-2 bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] p-6 min-h-[300px] flex flex-col"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Revenue Analytics</h3>
                        <div className="px-3 py-1 bg-gray-50 rounded-md text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-gray-100 flex items-center gap-1.5 cursor-pointer hover:bg-gray-100">
                            Last 7 Days <ChevronDown size={12} />
                        </div>
                    </div>
                    <div className="flex-1 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50 flex items-center justify-center">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Chart Visualization Area</p>
                    </div>
                </motion.div>

                {/* Right Panel Activities */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] p-6 min-h-[300px] flex flex-col"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Action Required</h3>
                    </div>

                    <div className="flex-1 flex flex-col gap-3">
                        {/* Mock critical action item */}
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-orange-50 border border-orange-100 p-3 rounded-xl flex items-center gap-3 hover:bg-orange-100 cursor-pointer transition-colors">
                                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                                    <Clock size={14} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-900">Order #ORD-8091</p>
                                    <p className="text-[10px] font-semibold text-gray-500">Waiting for confirmation (15 mins)</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

// Chevron Helper extracted locally
function ChevronDown({ size, ...props }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6" /></svg>
    )
}
