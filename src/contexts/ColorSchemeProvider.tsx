import { useCallback, useMemo, useState } from 'react';
import type { JSX } from 'react';
import {
    COLOR_SCHEME_STORAGE_KEY,
    DEFAULT_COLOR_SCHEME,
    LIGHT_COLOR_SCHEME,
    ColorSchemeContext,
    type ColorScheme
} from './colorSchemeStore';

const getInitialScheme = (): ColorScheme => {
    if (typeof window === 'undefined') {
        return DEFAULT_COLOR_SCHEME;
    }

    const stored = window.localStorage.getItem(COLOR_SCHEME_STORAGE_KEY);

    if (stored === DEFAULT_COLOR_SCHEME || stored === LIGHT_COLOR_SCHEME) {
        return stored;
    }

    return DEFAULT_COLOR_SCHEME;
};

export const ColorSchemeProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const [scheme, setScheme] = useState<ColorScheme>(getInitialScheme);

    const toggleScheme = useCallback((): void => {
        setScheme(current => {
            const next =
                current === DEFAULT_COLOR_SCHEME ? LIGHT_COLOR_SCHEME : DEFAULT_COLOR_SCHEME;
            window.localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, next);
            return next;
        });
    }, []);

    const value = useMemo(
        (): { scheme: ColorScheme; toggleScheme: () => void } => ({
            scheme,
            toggleScheme
        }),
        [scheme, toggleScheme]
    );

    return <ColorSchemeContext.Provider value={value}>{children}</ColorSchemeContext.Provider>;
};
