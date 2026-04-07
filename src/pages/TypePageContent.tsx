import { useCallback } from 'react';
import type { JSX } from 'react';
import { EmptyState, ErrorState, LoadingState } from '../components/common/AsyncState';
import { EventGroupGrid } from '../components/EventGroupGrid/EventGroupGrid';
import { HeaderPanel } from '../components/HeaderPanel/HeaderPanel';
import { useRefreshTimestamp } from '../contexts/useRefreshTimestamp';
import { useFetchedData } from '../hooks/data/useFetchedData';
import { loadTypeById } from '../services/apiService';
import type { ApiTypeResponse } from '../types/api';

export const TYPE_PAGE_CONTENT_LOADING_TEXT = 'Ładowanie danych o grupie...';
export const TYPE_PAGE_CONTENT_ERROR_TEXT = 'Nie udało się załadować danych.';
export const TYPE_PAGE_CONTENT_EVENT_COUNT_LABEL = 'Liczba wpisów';
export const TYPE_PAGE_CONTENT_EMPTY_TEXT = 'Brak pojazdów w tej grupie.';

interface TypePageContentProps {
    typeId: string;
}

export const TypePageContent = ({ typeId }: TypePageContentProps): JSX.Element => {
    const { refreshTimestamp } = useRefreshTimestamp();

    const loader = useCallback(
        async (signal?: AbortSignal): Promise<ApiTypeResponse> => {
            return await loadTypeById(typeId, refreshTimestamp ?? '', signal);
        },
        [refreshTimestamp, typeId]
    );

    const { data, isLoading, error, reload } = useFetchedData<ApiTypeResponse>({ loader });

    if (isLoading) {
        return <LoadingState text={TYPE_PAGE_CONTENT_LOADING_TEXT} />;
    }

    if (error || !data) {
        return <ErrorState message={error ?? TYPE_PAGE_CONTENT_ERROR_TEXT} onRetry={reload} />;
    }

    return (
        <>
            <HeaderPanel
                title={data.type_info.display_name || data.type_info.id}
                properties={[
                    {
                        label: TYPE_PAGE_CONTENT_EVENT_COUNT_LABEL,
                        value: data.event_group_list_info.event_count
                    }
                ]}
            />
            {data.event_groups.length > 0 ? (
                <EventGroupGrid
                    eventGroups={data.event_groups}
                    getLink={group => `/loco/${encodeURIComponent(group.id)}`}
                />
            ) : (
                <EmptyState text={TYPE_PAGE_CONTENT_EMPTY_TEXT} />
            )}
        </>
    );
};
