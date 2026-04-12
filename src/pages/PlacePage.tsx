import type { JSX } from 'react';
import { useParams } from 'react-router-dom';
import {
    EmptyState,
    ErrorState,
    InlineLoadingState,
    LoadingState
} from '../components/common/AsyncState';
import { EventList } from '../components/EventList/EventList';
import { HeaderPanel } from '../components/HeaderPanel/HeaderPanel';
import { useRefreshTimestamp } from '../contexts/useRefreshTimestamp';
import { usePaginatedData } from '../hooks/data/usePaginatedData';
import { useInfiniteScroll } from '../hooks/scroll/useInfiniteScroll';
import type { ApiPlaceResponse, ApiPlaceResponseMeta, ApiMergedEvent } from '../types/api';
import { isPlacePageCached, loadPlacePage } from '../services/apiService';
import { useCallback } from 'react';

export const PLACE_PAGE_LOADING_TEXT = 'Ładowanie danych o miejscu...';
export const PLACE_PAGE_ERROR_TEXT = 'Nie udało się załadować danych.';
export const PLACE_PAGE_EVENT_COUNT_LABEL = 'Liczba wpisów';
export const PLACE_PAGE_EMPTY_TEXT = 'Brak wpisów dla tego miejsca.';
export const PLACE_PAGE_INLINE_LOADING_TEXT = 'Ładowanie kolejnych wpisów...';

export const PlacePage = (): JSX.Element => {
    const { id = '' } = useParams();
    const { refreshTimestamp } = useRefreshTimestamp();

    const canLoad = Boolean(refreshTimestamp && id);

    const loader = useCallback(
        (page: number, signal?: AbortSignal): Promise<ApiPlaceResponse> =>
            loadPlacePage(id, page, refreshTimestamp ?? '', signal),
        [id, refreshTimestamp]
    );

    const isPageCached = useCallback(
        (page: number): boolean => isPlacePageCached(id, page, refreshTimestamp ?? ''),
        [id, refreshTimestamp]
    );

    const {
        meta,
        items,
        hasMore,
        isInitialLoading,
        isLoadingMore,
        initialError,
        loadingMoreError,
        loadMore,
        reload
    } = usePaginatedData<ApiMergedEvent, ApiPlaceResponseMeta>({
        enabled: canLoad,
        loader,
        isPageCached
    });

    const anchorRef = useInfiniteScroll({
        enabled: canLoad,
        hasMore,
        isLoading: isInitialLoading || isLoadingMore,
        onLoadMore: loadMore
    });

    if (isInitialLoading) {
        return <LoadingState text={PLACE_PAGE_LOADING_TEXT} />;
    }

    if (initialError || !meta) {
        return <ErrorState message={initialError ?? PLACE_PAGE_ERROR_TEXT} onRetry={reload} />;
    }

    return (
        <>
            <HeaderPanel
                title={meta.place_info.display_name}
                properties={[
                    {
                        label: PLACE_PAGE_EVENT_COUNT_LABEL,
                        value: meta.event_list_info.event_count
                    }
                ]}
            />

            {items.length > 0 ? (
                <EventList events={items} />
            ) : (
                <EmptyState text={PLACE_PAGE_EMPTY_TEXT} />
            )}

            {loadingMoreError ? <ErrorState message={loadingMoreError} onRetry={loadMore} /> : null}
            {isLoadingMore ? <InlineLoadingState text={PLACE_PAGE_INLINE_LOADING_TEXT} /> : null}
            <div ref={anchorRef} aria-hidden="true" />
        </>
    );
};
