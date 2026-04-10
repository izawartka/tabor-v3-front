import { useCallback, useMemo, useState } from 'react';
import type { JSX } from 'react';
import {
    DEFAULT_PRIVATE_MODE,
    PRIVATE_MODE_STORAGE_KEY,
    PrivateModeContext
} from './privateModeStore';

const getInitialPrivateMode = (): boolean => {
    if (typeof window === 'undefined') {
        return DEFAULT_PRIVATE_MODE;
    }

    const stored = window.localStorage.getItem(PRIVATE_MODE_STORAGE_KEY);

    if (stored === null) {
        return DEFAULT_PRIVATE_MODE;
    }

    return stored === '1';
};

export const PrivateModeProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const [privateMode, setPrivateMode] = useState<boolean>(getInitialPrivateMode);

    const togglePrivateMode = useCallback((): void => {
        setPrivateMode(current => {
            const next = !current;
            window.localStorage.setItem(PRIVATE_MODE_STORAGE_KEY, next ? '1' : '0');
            return next;
        });
    }, []);

    const value = useMemo(
        (): { privateMode: boolean; togglePrivateMode: () => void } => ({
            privateMode,
            togglePrivateMode
        }),
        [privateMode, togglePrivateMode]
    );

    return <PrivateModeContext.Provider value={value}>{children}</PrivateModeContext.Provider>;
};
