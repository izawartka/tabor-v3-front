import { useCallback, useEffect, useState } from 'react';
import { ApiError, HTTP_ERROR_GENERIC_MESSAGE } from '../../services/httpService';

interface UseFetchedDataOptions<ResponseT> {
    loader: (signal?: AbortSignal) => Promise<ResponseT>;
}

interface UseFetchedDataState<ResponseT> {
    data: ResponseT | null;
    isLoading: boolean;
    error: string | null;
    reload: () => void;
}

export const useFetchedData = <ResponseT>({
    loader
}: UseFetchedDataOptions<ResponseT>): UseFetchedDataState<ResponseT> => {
    const [data, setData] = useState<ResponseT | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadToken, setReloadToken] = useState<number>(0);

    useEffect((): (() => void) => {
        const controller = new AbortController();

        const run = async (): Promise<void> => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await loader(controller.signal);
                setData(response ?? null);
            } catch (err) {
                if (controller.signal.aborted) {
                    return;
                }

                if (err instanceof ApiError) {
                    setError(err.message);
                } else {
                    setError(HTTP_ERROR_GENERIC_MESSAGE);
                }
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
    }, [loader, reloadToken]);

    const reload = useCallback((): void => {
        setReloadToken(value => value + 1);
    }, []);

    return {
        data,
        isLoading,
        error,
        reload
    };
};
