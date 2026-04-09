import type { JSX } from 'react';
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
import type { ApiFavResponse, ApiFavResponseMeta, ApiMergedEvent } from '../types/api';
import { loadFavPage } from '../services/apiService';
import { useCallback } from 'react';

export const FAV_PAGE_LOADING_TEXT = 'Ładowanie danych o wpisach...';
export const FAV_PAGE_ERROR_TEXT = 'Nie udało się załadować danych.';
export const FAV_PAGE_EVENT_COUNT_LABEL = 'Liczba wpisów';
export const FAV_PAGE_EMPTY_TEXT = 'Brak wpisów.';
export const FAV_PAGE_INLINE_LOADING_TEXT = 'Ładowanie kolejnych wpisów...';

export const FavPage = (): JSX.Element => {
    const { refreshTimestamp } = useRefreshTimestamp();

    const canLoad = Boolean(refreshTimestamp);

    const loader = useCallback(
        (page: number, signal?: AbortSignal): Promise<ApiFavResponse> =>
            loadFavPage(page, refreshTimestamp ?? '', signal),
        [refreshTimestamp]
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
    } = usePaginatedData<ApiMergedEvent, ApiFavResponseMeta>({
        enabled: canLoad,
        loader
    });

    const anchorRef = useInfiniteScroll({
        enabled: canLoad,
        hasMore,
        isLoading: isInitialLoading || isLoadingMore,
        onLoadMore: loadMore
    });

    if (isInitialLoading) {
        return <LoadingState text={FAV_PAGE_LOADING_TEXT} />;
    }

    if (initialError || !meta) {
        return <ErrorState message={initialError ?? FAV_PAGE_ERROR_TEXT} onRetry={reload} />;
    }

    return (
        <>
            <HeaderPanel
                title="Dobre"
                properties={[
                    {
                        label: FAV_PAGE_EVENT_COUNT_LABEL,
                        value: meta.event_list_info.event_count
                    }
                ]}
            />

            {items.length > 0 ? (
                <EventList events={items} />
            ) : (
                <EmptyState text={FAV_PAGE_EMPTY_TEXT} />
            )}

            {loadingMoreError ? <ErrorState message={loadingMoreError} onRetry={loadMore} /> : null}
            {isLoadingMore ? <InlineLoadingState text={FAV_PAGE_INLINE_LOADING_TEXT} /> : null}
            <div ref={anchorRef} aria-hidden="true" />
        </>
    );
};
