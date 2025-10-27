import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

export function useOnboarding() {
    const { user: authUser } = useAuth();
    const [isFirstTime, setIsFirstTime] = useState(false);
    const [hasCompletedTour, setHasCompletedTour] = useState(false);
    const [isTourActive, setIsTourActive] = useState(false);

    // Check if user is first time
    useEffect(() => {
        if (!authUser?.id) return;

        const checkFirstTime = () => {
            const tourCompleted = localStorage.getItem(`tour_completed_${authUser.id}`);
            const hasVisitedBefore = localStorage.getItem(`visited_${authUser.id}`);

            if (!hasVisitedBefore) {
                setIsFirstTime(true);
                setIsTourActive(true);
                localStorage.setItem(`visited_${authUser.id}`, 'true');
            } else {
                setHasCompletedTour(!!tourCompleted);
            }
        };

        checkFirstTime();
    }, [authUser?.id]);

    const startTour = useCallback(() => {
        setIsTourActive(true);
    }, []);

    const completeTour = useCallback(() => {
        if (authUser?.id) {
            localStorage.setItem(`tour_completed_${authUser.id}`, 'true');
            setHasCompletedTour(true);
            setIsTourActive(false);
            setIsFirstTime(false);
        }
    }, [authUser?.id]);

    const skipTour = useCallback(() => {
        if (authUser?.id) {
            localStorage.setItem(`tour_completed_${authUser.id}`, 'skipped');
            setHasCompletedTour(true);
            setIsTourActive(false);
            setIsFirstTime(false);
        }
    }, [authUser?.id]);

    const resetTour = useCallback(() => {
        if (authUser?.id) {
            localStorage.removeItem(`tour_completed_${authUser.id}`);
            localStorage.removeItem(`visited_${authUser.id}`);
            setHasCompletedTour(false);
            setIsFirstTime(true);
            setIsTourActive(true);
        }
    }, [authUser?.id]);

    return {
        isFirstTime,
        hasCompletedTour,
        isTourActive,
        startTour,
        completeTour,
        skipTour,
        resetTour,
    };
}
