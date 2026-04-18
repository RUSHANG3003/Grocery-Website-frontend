'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white p-6 md:p-12 font-sans text-gray-800">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-8 font-medium">
                    <ArrowLeft size={20} className="mr-2" /> Back to Login
                </Link>

                <h1 className="text-4xl font-bold mb-6 text-gray-900">Privacy Policy</h1>
                <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-6 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-gray-900">1. Information We Collect</h2>
                        <p>We collect information you provide directly to us, such as when you create an account, update your profile, make a purchase, or communicate with us. This may include your name, email address, phone number, and delivery address.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-gray-900">2. How We Use Your Information</h2>
                        <p>We use the information we collect to provide, maintain, and improve our services, to process your transactions, giving you relevant information about your order status, and to communicate with you.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-gray-900">3. Information Sharing</h2>
                        <p>We do not share your personal information with third parties except as described in this policy, such as with delivery partners and payment processors necessary to fulfill your orders.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-gray-900">4. Data Security</h2>
                        <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-gray-900">5. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at support@groceryapp.com.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
