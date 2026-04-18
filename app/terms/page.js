'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white p-6 md:p-12 font-sans text-gray-800">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-8 font-medium">
                    <ArrowLeft size={20} className="mr-2" /> Back to Login
                </Link>

                <h1 className="text-4xl font-bold mb-6 text-gray-900">Terms of Service</h1>
                <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-6 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-gray-900">1. Introduction</h2>
                        <p>Welcome to Grocery App. By accessing or using our mobile application and related services, you agree to be bound by these Terms of Service.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-gray-900">2. Account Registration</h2>
                        <p>To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-gray-900">3. User Conduct</h2>
                        <p>You agree not to use the Service for any unlawful purpose or in any way that interrupts, damages, impairs, or renders the Service less efficient.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-gray-900">4. Ordering and Payment</h2>
                        <p>All orders are subject to acceptance and availability. Prices and delivery charges are displayed at checkout. Payment must be made at the time of order or upon delivery as applicable.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-gray-900">5. Termination</h2>
                        <p>We reserve the right to terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
