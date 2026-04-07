import { createContext } from 'react';

export interface RefreshTimestampContextValue {
    refreshTimestamp: string | null;
    isLoading: boolean;
    error: string | null;
    retry: () => void;
}

export const RefreshTimestampContext = createContext<RefreshTimestampContextValue | null>(null);
