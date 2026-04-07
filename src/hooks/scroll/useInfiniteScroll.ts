import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

export const INFINITE_SCROLL_ROOT_MARGIN = '500px';

interface UseInfiniteScrollOptions {
    enabled: boolean;
    hasMore: boolean;
    isLoading: boolean;
    onLoadMore: () => void;
    rootMargin?: string;
}

export const useInfiniteScroll = ({
    enabled,
    hasMore,
    isLoading,
    onLoadMore,
    rootMargin = INFINITE_SCROLL_ROOT_MARGIN
}: UseInfiniteScrollOptions): RefObject<HTMLDivElement | null> => {
    const anchorRef = useRef<HTMLDivElement | null>(null);

    useEffect((): (() => void) | undefined => {
        if (!enabled || !hasMore || isLoading || !anchorRef.current) {
            return;
        }

        const observer = new IntersectionObserver(
            entries => {
                if (entries.some(entry => entry.isIntersecting)) {
                    onLoadMore();
                }
            },
            { root: null, rootMargin, threshold: 0 }
        );

        observer.observe(anchorRef.current);

        return (): void => {
            observer.disconnect();
        };
    }, [enabled, hasMore, isLoading, onLoadMore, rootMargin]);

    return anchorRef;
};
