import { useCallback, useEffect, useMemo, useState } from 'react';
import type { JSX } from 'react';
import { loadRefreshTimestamp } from '../services/apiService';
import { ApiError } from '../services/httpService';
import {
    RefreshTimestampContext,
    type RefreshTimestampContextValue
} from './refreshTimestampStore';

export const REFRESH_TIMESTAMP_ERROR_MESSAGE = 'Nie udało się przygotować aplikacji.';

export const RefreshTimestampProvider = ({
    children
}: {
    children: React.ReactNode;
}): JSX.Element => {
    const [refreshTimestamp, setRefreshTimestamp] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadToken, setReloadToken] = useState<number>(0);

    useEffect((): (() => void) => {
        const controller = new AbortController();

        const run = async (): Promise<void> => {
            setIsLoading(true);
            setError(null);

            try {
                const value = await loadRefreshTimestamp(controller.signal);
                setRefreshTimestamp(value);
            } catch (err) {
                if (controller.signal.aborted) {
                    return;
                }

                if (err instanceof ApiError) {
                    setError(err.message);
                } else {
                    setError(REFRESH_TIMESTAMP_ERROR_MESSAGE);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        void run();

        return (): void => {
            controller.abort();
        };
    }, [reloadToken]);

    const retry = useCallback((): void => {
        setReloadToken(value => value + 1);
    }, []);

    const value = useMemo<RefreshTimestampContextValue>(
        (): {
            refreshTimestamp: string | null;
            isLoading: boolean;
            error: string | null;
            retry: () => void;
        } => ({
            refreshTimestamp,
            isLoading,
            error,
            retry
        }),
        [refreshTimestamp, isLoading, error, retry]
    );

    return (
        <RefreshTimestampContext.Provider value={value}>
            {children}
        </RefreshTimestampContext.Provider>
    );
};
