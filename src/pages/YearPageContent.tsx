import { useCallback } from 'react';
import type { JSX } from 'react';
import { EmptyState, ErrorState, LoadingState } from '../components/common/AsyncState';
import { EventGroupGrid } from '../components/EventGroupGrid/EventGroupGrid';
import { HeaderPanel } from '../components/HeaderPanel/HeaderPanel';
import { useRefreshTimestamp } from '../contexts/useRefreshTimestamp';
import { useFetchedData } from '../hooks/data/useFetchedData';
import { loadYear } from '../services/apiService';
import type { ApiYearResponse } from '../types/api';

export const YEAR_PAGE_CONTENT_LOADING_TEXT = 'Ładowanie danych o roku...';
export const YEAR_PAGE_CONTENT_ERROR_TEXT = 'Nie udało się załadować danych.';
export const YEAR_PAGE_CONTENT_EVENT_COUNT_LABEL = 'Liczba wpisów';
export const YEAR_PAGE_CONTENT_EMPTY_TEXT = 'Brak dat w tym roku.';

interface YearPageContentProps {
    year: string;
}

export const YearPageContent = ({ year }: YearPageContentProps): JSX.Element => {
    const { refreshTimestamp } = useRefreshTimestamp();

    const loader = useCallback(
        async (signal?: AbortSignal): Promise<ApiYearResponse> => {
            return await loadYear(year, refreshTimestamp ?? '', signal);
        },
        [refreshTimestamp, year]
    );

    const { data, isLoading, error, reload } = useFetchedData<ApiYearResponse>({ loader });

    if (isLoading) {
        return <LoadingState text={YEAR_PAGE_CONTENT_LOADING_TEXT} />;
    }

    if (error || !data) {
        return <ErrorState message={error ?? YEAR_PAGE_CONTENT_ERROR_TEXT} onRetry={reload} />;
    }

    return (
        <>
            <HeaderPanel
                title={data.year_info.year}
                properties={[
                    {
                        label: YEAR_PAGE_CONTENT_EVENT_COUNT_LABEL,
                        value: data.event_group_list_info.event_count
                    }
                ]}
            />
            {data.event_groups.length > 0 ? (
                <EventGroupGrid
                    eventGroups={data.event_groups}
                    getLink={group => `/date/${encodeURIComponent(group.id)}`}
                />
            ) : (
                <EmptyState text={YEAR_PAGE_CONTENT_EMPTY_TEXT} />
            )}
        </>
    );
};
