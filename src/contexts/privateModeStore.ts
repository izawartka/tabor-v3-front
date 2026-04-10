import { createContext } from 'react';

export const PRIVATE_MODE_STORAGE_KEY = 'tabor3.private-mode';
export const DEFAULT_PRIVATE_MODE = false;

export interface PrivateModeContextValue {
    privateMode: boolean;
    togglePrivateMode: () => void;
}

export const PrivateModeContext = createContext<PrivateModeContextValue | null>(null);
