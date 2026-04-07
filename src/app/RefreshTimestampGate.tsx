import type { JSX } from 'react';
import { ErrorState, LoadingState } from '../components/common/AsyncState';
import { useRefreshTimestamp } from '../contexts/useRefreshTimestamp';

export const REFRESH_TIMESTAMP_GATE_LOADING_TEXT = 'Przygotowanie aplikacji...';
export const REFRESH_TIMESTAMP_GATE_EMPTY_TEXT = 'Brak znacznika odświeżenia danych.';

export const RefreshTimestampGate = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const { refreshTimestamp, isLoading, error, retry } = useRefreshTimestamp();

    if (isLoading) {
        return <LoadingState text={REFRESH_TIMESTAMP_GATE_LOADING_TEXT} />;
    }

    if (error) {
        return <ErrorState message={error} onRetry={retry} />;
    }

    if (!refreshTimestamp) {
        return <ErrorState message={REFRESH_TIMESTAMP_GATE_EMPTY_TEXT} onRetry={retry} />;
    }

    return <>{children}</>;
};
