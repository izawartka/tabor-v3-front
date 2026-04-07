import { useCallback } from 'react';
import type { JSX } from 'react';
import { EmptyState, ErrorState, LoadingState } from '../components/common/AsyncState';
import { EventGroupGrid } from '../components/EventGroupGrid/EventGroupGrid';
import { useRefreshTimestamp } from '../contexts/useRefreshTimestamp';
import { useFetchedData } from '../hooks/data/useFetchedData';
import { loadTypes } from '../services/apiService';
import type { ApiTypesResponse } from '../types/api';

export const TYPES_PAGE_CONTENT_LOADING_TEXT = 'Ładowanie grup pojazdów...';
export const TYPES_PAGE_CONTENT_ERROR_TEXT = 'Nie udało się załadować danych.';
export const TYPES_PAGE_CONTENT_EMPTY_TEXT = 'Brak grup pojazdów.';

export const TypesPageContent = (): JSX.Element => {
    const { refreshTimestamp } = useRefreshTimestamp();

    const loader = useCallback(
        async (signal?: AbortSignal): Promise<ApiTypesResponse> => {
            return await loadTypes(refreshTimestamp ?? '', signal);
        },
        [refreshTimestamp]
    );

    const { data, isLoading, error, reload } = useFetchedData<ApiTypesResponse>({ loader });

    if (isLoading) {
        return <LoadingState text={TYPES_PAGE_CONTENT_LOADING_TEXT} />;
    }

    if (error || !data) {
        return <ErrorState message={error ?? TYPES_PAGE_CONTENT_ERROR_TEXT} onRetry={reload} />;
    }

    if (data.event_groups.length === 0) {
        return <EmptyState text={TYPES_PAGE_CONTENT_EMPTY_TEXT} />;
    }

    return (
        <EventGroupGrid
            eventGroups={data.event_groups}
            getLink={group => `/type/${encodeURIComponent(group.id)}`}
        />
    );
};
