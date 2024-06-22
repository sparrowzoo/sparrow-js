import { useState, useEffect } from 'react';
export default function StatusBar() {
    const [isOnline, setIsOnline] = useState(true);
    useEffect(() => {
        function handleOnline() {
            setIsOnline(true);
            console.log("online");

        }
        function handleOffline() {
            setIsOnline(false);
            console.log("offline");
        }
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
    return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}