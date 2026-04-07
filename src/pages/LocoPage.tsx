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
import type { ApiLocoResponse, ApiLocoResponseMeta, ApiMergedEvent } from '../types/api';
import { loadLocoPage } from '../services/apiService';
import { useCallback } from 'react';

export const LOCO_PAGE_LOADING_TEXT = 'Ładowanie danych o pojeździe...';
export const LOCO_PAGE_ERROR_TEXT = 'Nie udało się załadować danych.';
export const LOCO_PAGE_GROUP_LABEL = 'Grupa';
export const LOCO_PAGE_GROUP_REF_TEXT = 'Zobacz wszystkie pojazdy z tej grupy';
export const LOCO_PAGE_FACTORY_LABEL = 'Oznaczenie fabryczne';
export const LOCO_PAGE_EVENT_COUNT_LABEL = 'Liczba wpisów';
export const LOCO_PAGE_EMPTY_TEXT = 'Brak wpisów dla tego pojazdu.';
export const LOCO_PAGE_INLINE_LOADING_TEXT = 'Ładowanie kolejnych wpisów...';

export const LocoPage = (): JSX.Element => {
    const { id = '' } = useParams();
    const { refreshTimestamp } = useRefreshTimestamp();

    const canLoad = Boolean(refreshTimestamp && id);

    const loader = useCallback(
        (page: number, signal?: AbortSignal): Promise<ApiLocoResponse> =>
            loadLocoPage(id, page, refreshTimestamp ?? '', signal),
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
    } = usePaginatedData<ApiMergedEvent, ApiLocoResponseMeta>({
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
        return <LoadingState text={LOCO_PAGE_LOADING_TEXT} />;
    }

    if (initialError || !meta) {
        return <ErrorState message={initialError ?? LOCO_PAGE_ERROR_TEXT} onRetry={reload} />;
    }

    return (
        <>
            <HeaderPanel
                title={meta.loco_info.class_no}
                properties={[
                    {
                        label: LOCO_PAGE_GROUP_LABEL,
                        value: meta.type_info.display_name,
                        ...(meta.type_info.ref
                            ? {
                                  reference: {
                                      ref: meta.type_info.ref,
                                      href: `/type/${encodeURIComponent(meta.type_info.id)}`,
                                      refText: LOCO_PAGE_GROUP_REF_TEXT
                                  }
                              }
                            : {})
                    },
                    {
                        label: LOCO_PAGE_FACTORY_LABEL,
                        value: meta.loco_info.series_no
                    },
                    {
                        label: LOCO_PAGE_EVENT_COUNT_LABEL,
                        value: meta.event_list_info.event_count
                    }
                ]}
            />

            {items.length > 0 ? (
                <EventList events={items} />
            ) : (
                <EmptyState text={LOCO_PAGE_EMPTY_TEXT} />
            )}

            {loadingMoreError ? <ErrorState message={loadingMoreError} onRetry={loadMore} /> : null}
            {isLoadingMore ? <InlineLoadingState text={LOCO_PAGE_INLINE_LOADING_TEXT} /> : null}
            <div ref={anchorRef} aria-hidden="true" />
        </>
    );
};
