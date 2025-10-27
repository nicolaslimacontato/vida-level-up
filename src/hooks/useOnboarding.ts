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
            
            // Se o tour já foi completado ou pulado, não mostrar novamente
            if (tourCompleted) {
                setHasCompletedTour(true);
                setIsFirstTime(false);
                setIsTourActive(false);
                return;
            }

            // Se é a primeira vez (não tem registro de tour completado)
            setIsFirstTime(true);
            setIsTourActive(true);
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
