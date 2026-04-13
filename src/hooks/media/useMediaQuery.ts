import { useEffect, useState } from 'react';

const supportsMatchMedia = (): boolean => typeof window !== 'undefined' && 'matchMedia' in window;

const getMatches = (query: string): boolean => {
    if (!supportsMatchMedia()) {
        return false;
    }

    return window.matchMedia(query).matches;
};

export const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState<boolean>(() => getMatches(query));

    useEffect((): (() => void) | void => {
        if (!supportsMatchMedia()) {
            return;
        }

        const mediaQueryList = window.matchMedia(query);

        const onChange = (): void => {
            setMatches(mediaQueryList.matches);
        };

        onChange();

        mediaQueryList.addEventListener('change', onChange);

        return (): void => {
            mediaQueryList.removeEventListener('change', onChange);
        };
    }, [query]);

    return matches;
};
