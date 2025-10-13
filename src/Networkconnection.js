import React, { useEffect, useState } from 'react';


const OfflinePage = () => {
    return (
        <div style={{  display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
            textAlign: 'center',
            padding: '20px',
            boxSizing: 'border-box', 
            backgroundColor: '#f0f0f0', // Optional: background color
            position: 'fixed', // Make sure it's fixed on the viewport
            top: 0,
            left: 0,
            zIndex: 9999, // Ensure it appears on top
            }}>
                
            <h1 style={{ fontSize: '3rem' }}>🌐</h1> {/* Online/Offline Globe Emoji */}   
            <h1>You are offline</h1>
            <p>Please check your network connection and try again.</p>
        </div>
    );          
};

const NetworkListener = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            history.push('/'); // Redirect to home or another page when online
        };
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!isOnline) {
        return <OfflinePage />;
    }

    return null; // Return null when online; can be empty or render other content
};

export default NetworkListener;