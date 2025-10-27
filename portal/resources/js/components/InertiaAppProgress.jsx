import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export function InertiaAppProgress() {
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        const start = () => setIsNavigating(true);
        const finish = () => setIsNavigating(false);

        const unregisterStart = router.on('start', start);
        const unregisterFinish = router.on('finish', finish);
        const unregisterError = router.on('error', finish);

        return () => {
            unregisterStart();
            unregisterFinish();
            unregisterError();
        };
    }, []);

    return (
        <div
            className={`pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 bg-cyan-400 transition-opacity duration-300 ${
                isNavigating ? 'opacity-100 animate-pulse' : 'opacity-0'
            }`}
        />
    );
}
