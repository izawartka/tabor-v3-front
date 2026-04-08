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
import type { ApiDateResponse, ApiDateResponseMeta, ApiMergedEvent } from '../types/api';
import { loadDatePage } from '../services/apiService';
import { useCallback } from 'react';

export const DATE_PAGE_LOADING_TEXT = 'Ładowanie danych o dacie...';
export const DATE_PAGE_ERROR_TEXT = 'Nie udało się załadować danych.';
export const DATE_PAGE_GROUP_LABEL = 'Rok';
export const DATE_PAGE_GROUP_REF_TEXT = 'Zobacz wszystkie daty z tego roku';
export const DATE_PAGE_EVENT_COUNT_LABEL = 'Liczba wpisów';
export const DATE_PAGE_EMPTY_TEXT = 'Brak wpisów dla tej daty.';
export const DATE_PAGE_INLINE_LOADING_TEXT = 'Ładowanie kolejnych wpisów...';

export const DatePage = (): JSX.Element => {
    const { date = '' } = useParams();
    const { refreshTimestamp } = useRefreshTimestamp();

    const canLoad = Boolean(refreshTimestamp && date);

    const loader = useCallback(
        (page: number, signal?: AbortSignal): Promise<ApiDateResponse> =>
            loadDatePage(date, page, refreshTimestamp ?? '', signal),
        [date, refreshTimestamp]
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
    } = usePaginatedData<ApiMergedEvent, ApiDateResponseMeta>({
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
        return <LoadingState text={DATE_PAGE_LOADING_TEXT} />;
    }

    if (initialError || !meta) {
        return <ErrorState message={initialError ?? DATE_PAGE_ERROR_TEXT} onRetry={reload} />;
    }

    return (
        <>
            <HeaderPanel
                title={meta.date_info.date}
                properties={[
                    {
                        label: DATE_PAGE_GROUP_LABEL,
                        value: meta.date_info.year,
                        ...(meta.date_info.year_ref
                            ? {
                                  reference: {
                                      ref: meta.date_info.year_ref,
                                      href: `/year/${encodeURIComponent(meta.date_info.year)}`,
                                      refText: DATE_PAGE_GROUP_REF_TEXT
                                  }
                              }
                            : {})
                    },
                    {
                        label: DATE_PAGE_EVENT_COUNT_LABEL,
                        value: meta.event_list_info.event_count
                    }
                ]}
            />

            {items.length > 0 ? (
                <EventList events={items} />
            ) : (
                <EmptyState text={DATE_PAGE_EMPTY_TEXT} />
            )}

            {loadingMoreError ? <ErrorState message={loadingMoreError} onRetry={loadMore} /> : null}
            {isLoadingMore ? <InlineLoadingState text={DATE_PAGE_INLINE_LOADING_TEXT} /> : null}
            <div ref={anchorRef} aria-hidden="true" />
        </>
    );
};
