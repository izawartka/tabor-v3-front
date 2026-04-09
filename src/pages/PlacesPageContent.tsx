import { useCallback } from 'react';
import type { JSX } from 'react';
import { EmptyState, ErrorState, LoadingState } from '../components/common/AsyncState';
import { EventGroupGrid } from '../components/EventGroupGrid/EventGroupGrid';
import { useRefreshTimestamp } from '../contexts/useRefreshTimestamp';
import { useFetchedData } from '../hooks/data/useFetchedData';
import { loadPlaces } from '../services/apiService';
import type { ApiPlacesResponse } from '../types/api';

export const PLACES_PAGE_CONTENT_LOADING_TEXT = 'Ładowanie miejsc...';
export const PLACES_PAGE_CONTENT_ERROR_TEXT = 'Nie udało się załadować danych.';
export const PLACES_PAGE_CONTENT_EMPTY_TEXT = 'Brak miejsc.';

export const PlacesPageContent = (): JSX.Element => {
    const { refreshTimestamp } = useRefreshTimestamp();

    const loader = useCallback(
        async (signal?: AbortSignal): Promise<ApiPlacesResponse> => {
            return await loadPlaces(refreshTimestamp ?? '', signal);
        },
        [refreshTimestamp]
    );

    const { data, isLoading, error, reload } = useFetchedData<ApiPlacesResponse>({ loader });

    if (isLoading) {
        return <LoadingState text={PLACES_PAGE_CONTENT_LOADING_TEXT} />;
    }

    if (error || !data) {
        return <ErrorState message={error ?? PLACES_PAGE_CONTENT_ERROR_TEXT} onRetry={reload} />;
    }

    if (data.event_groups.length === 0) {
        return <EmptyState text={PLACES_PAGE_CONTENT_EMPTY_TEXT} />;
    }

    return (
        <EventGroupGrid
            eventGroups={data.event_groups}
            getLink={group => `/place/${encodeURIComponent(group.id)}`}
        />
    );
};
