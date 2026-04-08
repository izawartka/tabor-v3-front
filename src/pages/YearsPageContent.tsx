import { useCallback } from 'react';
import type { JSX } from 'react';
import { EmptyState, ErrorState, LoadingState } from '../components/common/AsyncState';
import { EventGroupGrid } from '../components/EventGroupGrid/EventGroupGrid';
import { useRefreshTimestamp } from '../contexts/useRefreshTimestamp';
import { useFetchedData } from '../hooks/data/useFetchedData';
import { loadYears } from '../services/apiService';
import type { ApiYearsResponse } from '../types/api';

export const YEARS_PAGE_CONTENT_LOADING_TEXT = 'Ładowanie lat...';
export const YEARS_PAGE_CONTENT_ERROR_TEXT = 'Nie udało się załadować danych.';
export const YEARS_PAGE_CONTENT_EMPTY_TEXT = 'Brak lat.';

export const YearsPageContent = (): JSX.Element => {
    const { refreshTimestamp } = useRefreshTimestamp();

    const loader = useCallback(
        async (signal?: AbortSignal): Promise<ApiYearsResponse> => {
            return await loadYears(refreshTimestamp ?? '', signal);
        },
        [refreshTimestamp]
    );

    const { data, isLoading, error, reload } = useFetchedData<ApiYearsResponse>({ loader });

    if (isLoading) {
        return <LoadingState text={YEARS_PAGE_CONTENT_LOADING_TEXT} />;
    }

    if (error || !data) {
        return <ErrorState message={error ?? YEARS_PAGE_CONTENT_ERROR_TEXT} onRetry={reload} />;
    }

    if (data.event_groups.length === 0) {
        return <EmptyState text={YEARS_PAGE_CONTENT_EMPTY_TEXT} />;
    }

    return (
        <EventGroupGrid
            eventGroups={data.event_groups}
            getLink={group => `/year/${encodeURIComponent(group.id)}`}
        />
    );
};
