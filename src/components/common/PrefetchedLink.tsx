import type { JSX } from 'react';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { RefreshTimestampContext } from '../../contexts/refreshTimestampStore';
import { prefetchRouteData } from '../../services/prefetchService';

export interface PrefetchedLinkProps extends LinkProps {
    prefetchMode?: 'auto' | 'none';
}

const getPathFromTo = (to: LinkProps['to']): string | null => {
    if (typeof to === 'string') {
        return to;
    }

    if (!to || typeof to !== 'object') {
        return null;
    }

    return typeof to.pathname === 'string' ? to.pathname : null;
};

const scheduleLowPriority = (task: () => void): (() => void) => {
    const w = window as Window & {
        requestIdleCallback?: (callback: () => void) => number;
        cancelIdleCallback?: (handle: number) => void;
    };

    if (typeof w.requestIdleCallback === 'function') {
        const handle = w.requestIdleCallback(() => {
            task();
        });

        return (): void => {
            w.cancelIdleCallback?.(handle);
        };
    }

    const handle = window.setTimeout(task, 0);

    return (): void => {
        window.clearTimeout(handle);
    };
};

export const PrefetchedLink = ({
    to,
    prefetchMode = 'auto',
    onMouseEnter,
    onFocus,
    onPointerDown,
    ...rest
}: PrefetchedLinkProps): JSX.Element => {
    const refreshContext = useContext(RefreshTimestampContext);
    const didPrefetchRef = useRef<boolean>(false);
    const cancelRef = useRef<(() => void) | null>(null);

    const triggerPrefetch = useCallback((): void => {
        if (prefetchMode === 'none' || didPrefetchRef.current) {
            return;
        }

        const refreshTimestamp = refreshContext?.refreshTimestamp;
        const path = getPathFromTo(to);

        if (!refreshTimestamp || !path) {
            return;
        }

        didPrefetchRef.current = true;
        cancelRef.current?.();
        cancelRef.current = scheduleLowPriority(() => {
            prefetchRouteData(path, refreshTimestamp);
        });
    }, [prefetchMode, refreshContext?.refreshTimestamp, to]);

    useEffect(() => {
        return (): void => {
            cancelRef.current?.();
        };
    }, []);

    return (
        <Link
            {...rest}
            to={to}
            onMouseEnter={event => {
                triggerPrefetch();
                onMouseEnter?.(event);
            }}
            onFocus={event => {
                triggerPrefetch();
                onFocus?.(event);
            }}
            onPointerDown={event => {
                triggerPrefetch();
                onPointerDown?.(event);
            }}
        />
    );
};
