import { useCallback, useEffect, useRef, useState } from 'react';
import type {
    ApiPaginatedResponse,
    ApiPaginatedResponseFirstPage,
    ApiPaginationInfo
} from '../../types/api';
import { ApiError, HTTP_ERROR_GENERIC_MESSAGE } from '../../services/httpService';

export interface UsePaginatedDataOptions<ItemT, MetaT> {
    enabled: boolean;
    loader: (page: number, signal?: AbortSignal) => Promise<ApiPaginatedResponse<ItemT, MetaT>>;
    isPageCached?: (page: number) => boolean;
}

export interface UsePaginatedDataResult<ItemT, MetaT> {
    meta: MetaT | null;
    items: ItemT[];
    hasMore: boolean;
    isInitialLoading: boolean;
    isLoadingMore: boolean;
    initialError: string | null;
    loadingMoreError: string | null;
    loadMore: () => void;
    reload: () => void;
}

const toErrorMessage = (error: unknown): string => {
    if (error instanceof ApiError) {
        return error.message;
    }

    return HTTP_ERROR_GENERIC_MESSAGE;
};

export const usePaginatedData = <ItemT, MetaT>({
    enabled,
    loader,
    isPageCached
}: UsePaginatedDataOptions<ItemT, MetaT>): UsePaginatedDataResult<ItemT, MetaT> => {
    const [meta, setMeta] = useState<MetaT | null>(null);
    const [paginationInfo, setPaginationInfo] = useState<ApiPaginationInfo | null>(null);
    const [items, setItems] = useState<ItemT[]>([]);
    const [page, setPage] = useState<number>(0);
    const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [initialError, setInitialError] = useState<string | null>(null);
    const [loadingMoreError, setLoadingMoreError] = useState<string | null>(null);
    const [reloadToken, setReloadToken] = useState<number>(0);

    const requestControllerRef = useRef<AbortController | null>(null);
    const requestIdRef = useRef<number>(0);

    const resetState = useCallback((): void => {
        setMeta(null);
        setPaginationInfo(null);
        setItems([]);
        setPage(0);
        setIsLoadingMore(false);
        setInitialError(null);
        setLoadingMoreError(null);
    }, []);

    const loadPage = useCallback(
        async (targetPage: number): Promise<void> => {
            requestControllerRef.current?.abort();

            const controller = new AbortController();
            requestControllerRef.current = controller;
            const requestId = requestIdRef.current + 1;
            requestIdRef.current = requestId;

            if (targetPage === 0) {
                setIsInitialLoading(true);
                setInitialError(null);
            } else {
                setIsLoadingMore(true);
                setLoadingMoreError(null);
            }

            try {
                const response = await loader(targetPage, controller.signal);

                if (controller.signal.aborted || requestId !== requestIdRef.current) {
                    return;
                }

                if (targetPage === 0) {
                    const firstPageResponse = response as ApiPaginatedResponseFirstPage<
                        ItemT,
                        MetaT
                    >;
                    setMeta(firstPageResponse.meta);
                    setPaginationInfo(firstPageResponse.pagination_info);

                    const pageCount = firstPageResponse.pagination_info.page_count;
                    let lastLoadedPage = 0;
                    let mergedItems = response.items;

                    for (let nextPage = 1; nextPage < pageCount; nextPage += 1) {
                        if (!isPageCached?.(nextPage)) {
                            break;
                        }

                        const cachedPageResponse = await loader(nextPage, controller.signal);

                        if (controller.signal.aborted || requestId !== requestIdRef.current) {
                            return;
                        }

                        mergedItems = [...mergedItems, ...cachedPageResponse.items];
                        lastLoadedPage = nextPage;
                    }

                    setItems(mergedItems);
                    setPage(lastLoadedPage);
                } else {
                    setItems(current => [...current, ...response.items]);
                    setPage(targetPage);
                }
            } catch (error) {
                if (controller.signal.aborted || requestId !== requestIdRef.current) {
                    return;
                }

                const message = toErrorMessage(error);
                if (targetPage === 0) {
                    setInitialError(message);
                } else {
                    setLoadingMoreError(message);
                }
            } finally {
                if (requestId === requestIdRef.current) {
                    requestControllerRef.current = null;

                    if (targetPage === 0) {
                        setIsInitialLoading(false);
                    } else {
                        setIsLoadingMore(false);
                    }
                }
            }
        },
        [isPageCached, loader]
    );

    useEffect((): (() => void) | undefined => {
        if (!enabled) {
            requestControllerRef.current?.abort();
            requestIdRef.current += 1;
            resetState();
            setIsInitialLoading(false);
            return;
        }

        resetState();
        void loadPage(0);

        return (): void => {
            requestControllerRef.current?.abort();
        };
    }, [enabled, loadPage, reloadToken, resetState]);

    const loadMore = useCallback((): void => {
        if (!enabled || isInitialLoading || isLoadingMore) {
            return;
        }

        if (paginationInfo === null) {
            return;
        }

        const nextPage = page + 1;
        if (nextPage >= paginationInfo.page_count) {
            return;
        }

        void loadPage(nextPage);
    }, [enabled, isInitialLoading, isLoadingMore, loadPage, page, paginationInfo]);

    const reload = useCallback((): void => {
        setReloadToken(value => value + 1);
    }, []);

    const hasMore = paginationInfo ? page + 1 < paginationInfo.page_count : false;

    return {
        meta,
        items,
        hasMore,
        isInitialLoading,
        isLoadingMore,
        initialError,
        loadingMoreError,
        loadMore,
        reload
    };
};
