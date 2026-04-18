'use client';

import { useState } from 'react';
import SplashScreen from '../components/SplashScreen';
import LoginPage from '../components/LoginPage';

export default function Home() {
    const [showSplash, setShowSplash] = useState(true);

    return (
        <main className="min-h-screen bg-white">
            {showSplash ? (
                <SplashScreen onFinish={() => setShowSplash(false)} />
            ) : (
                <LoginPage />
            )}
        </main>
    );
}
