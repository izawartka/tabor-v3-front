import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export const SCROLL_STORAGE_KEY = 'tabor-v3-front:scroll-positions';
export const RESTORE_TIMEOUT_MS = 4000;
export const SAVE_THROTTLE_MS = 120;
export const NAVIGATION_GUARD_MS = 500;

type ScrollPositions = Record<string, number>;

const readPositions = (): ScrollPositions => {
    try {
        const value = window.sessionStorage.getItem(SCROLL_STORAGE_KEY);
        return value ? (JSON.parse(value) as ScrollPositions) : {};
    } catch {
        return {};
    }
};

const clearPositions = (): void => {
    try {
        window.sessionStorage.removeItem(SCROLL_STORAGE_KEY);
    } catch {
        return;
    }
};

const savePosition = (routeKey: string, top: number): void => {
    const positions = readPositions();
    positions[routeKey] = top;

    try {
        window.sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(positions));
    } catch {
        return;
    }
};

const readPosition = (routeKey: string): number | null => {
    const value = readPositions()[routeKey];
    return typeof value === 'number' ? value : null;
};

const getCurrentTop = (): number =>
    window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

const getMaxTop = (): number =>
    Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) -
    window.innerHeight;

export const useScrollRestoration = (): void => {
    const location = useLocation();
    const navigationType = useNavigationType();
    const routeKey = `${location.pathname}${location.search}${location.hash}`;
    const latestRouteKeyRef = useRef<string>(routeKey);
    const restoreTargetRef = useRef<number | null>(null);
    const isRestoringRef = useRef<boolean>(false);
    const navigationArmedAtRef = useRef<number>(0);
    const lastSavedAtRef = useRef<number>(0);
    const saveRafRef = useRef<number>(0);

    useEffect((): void => {
        latestRouteKeyRef.current = routeKey;
    }, [routeKey]);

    useEffect((): (() => void) => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        const handleBeforeUnload = (): void => {
            clearPositions();
        };

        const armNavigationGuard = (): void => {
            const currentRouteKey = latestRouteKeyRef.current;
            const currentTop = getCurrentTop();
            savePosition(currentRouteKey, currentTop);

            navigationArmedAtRef.current = Date.now();
        };

        const handleDocumentClickCapture = (event: MouseEvent): void => {
            const target = event.target;
            if (!(target instanceof Element)) {
                return;
            }

            const anchor = target.closest('a[href]');
            if (!anchor) {
                return;
            }

            armNavigationGuard();
        };

        const handlePopState = (): void => {
            armNavigationGuard();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('click', handleDocumentClickCapture, true);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('click', handleDocumentClickCapture, true);
            window.removeEventListener('popstate', handlePopState);
            if ('scrollRestoration' in window.history) {
                window.history.scrollRestoration = 'auto';
            }
        };
    }, []);

    useEffect((): (() => void) => {
        const saveCurrentPosition = (): void => {
            if (isRestoringRef.current) {
                return;
            }

            const now = Date.now();
            if (now - navigationArmedAtRef.current <= NAVIGATION_GUARD_MS) {
                return;
            }

            if (now - lastSavedAtRef.current < SAVE_THROTTLE_MS) {
                return;
            }

            lastSavedAtRef.current = now;
            savePosition(routeKey, getCurrentTop());
        };

        const onScroll = (): void => {
            if (saveRafRef.current !== 0) {
                return;
            }

            saveRafRef.current = window.requestAnimationFrame((): void => {
                saveRafRef.current = 0;
                saveCurrentPosition();
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', onScroll);

            if (saveRafRef.current !== 0) {
                window.cancelAnimationFrame(saveRafRef.current);
                saveRafRef.current = 0;
            }
        };
    }, [routeKey]);

    useEffect((): void | (() => void) => {
        if (navigationType !== 'POP') {
            restoreTargetRef.current = null;
            isRestoringRef.current = false;
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
            return;
        }

        restoreTargetRef.current = readPosition(routeKey);
        const restoreTarget = restoreTargetRef.current;
        if (restoreTarget === null) {
            return;
        }

        isRestoringRef.current = true;

        let active = true;
        let frameId = 0;
        const startedAt = Date.now();

        const restore = (): void => {
            if (!active) {
                return;
            }

            const maxTop = Math.max(0, getMaxTop());
            const targetTop = Math.min(Math.max(0, restoreTarget), maxTop);
            window.scrollTo({ top: targetTop, left: 0, behavior: 'auto' });

            const reached = Math.abs(getCurrentTop() - targetTop) <= 1;
            const enoughContent = maxTop >= restoreTarget;

            if ((reached && enoughContent) || Date.now() - startedAt > RESTORE_TIMEOUT_MS) {
                restoreTargetRef.current = null;
                isRestoringRef.current = false;
                return;
            }

            frameId = window.requestAnimationFrame(restore);
        };

        window.addEventListener('resize', restore);
        frameId = window.requestAnimationFrame(restore);

        return () => {
            active = false;
            window.removeEventListener('resize', restore);
            isRestoringRef.current = false;

            if (frameId !== 0) {
                window.cancelAnimationFrame(frameId);
            }
        };
    }, [navigationType, routeKey]);
};
