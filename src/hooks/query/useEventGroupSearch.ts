import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError, HTTP_ERROR_GENERIC_MESSAGE } from '../../services/httpService';
import type { ApiEventGroupListResponse } from '../../types/api';
import { isSearchQueryActive, normalizeSearchQuery } from '../../utils/search';

interface UseEventGroupSearchOptions {
    query: string;
    minQueryLength: number;
    loader: (query: string, signal?: AbortSignal) => Promise<ApiEventGroupListResponse>;
}

interface UseEventGroupSearchResult {
    normalizedQuery: string;
    isActive: boolean;
    data: ApiEventGroupListResponse | null;
    isLoading: boolean;
    error: string | null;
    reload: () => void;
}

const toErrorMessage = (error: unknown): string => {
    if (error instanceof ApiError) {
        return error.message;
    }

    return HTTP_ERROR_GENERIC_MESSAGE;
};

export const useEventGroupSearch = ({
    query,
    minQueryLength,
    loader
}: UseEventGroupSearchOptions): UseEventGroupSearchResult => {
    const [data, setData] = useState<ApiEventGroupListResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [reloadToken, setReloadToken] = useState<number>(0);

    const normalizedQuery = useMemo((): string => normalizeSearchQuery(query), [query]);
    const isActive = isSearchQueryActive(normalizedQuery, minQueryLength);

    useEffect((): (() => void) | undefined => {
        if (!isActive) {
            setData(null);
            setIsLoading(false);
            setError(null);
            return;
        }

        const controller = new AbortController();

        const run = async (): Promise<void> => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await loader(normalizedQuery, controller.signal);
                setData(response);
            } catch (err) {
                if (controller.signal.aborted) {
                    return;
                }

                setError(toErrorMessage(err));
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        void run();

        return (): void => {
            controller.abort();
        };
    }, [isActive, loader, normalizedQuery, reloadToken]);

    const reload = useCallback((): void => {
        setReloadToken(current => current + 1);
    }, []);

    return {
        normalizedQuery,
        isActive,
        data,
        isLoading,
        error,
        reload
    };
};
