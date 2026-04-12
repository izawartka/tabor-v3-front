import { act, renderHook, waitFor } from '@testing-library/react';
import { usePaginatedData, type UsePaginatedDataResult } from '../usePaginatedData';

interface TestMeta {
    title: string;
}

interface TestItem {
    id: string;
}

export const USE_PAGINATED_DATA_STALE_ID = 'stale';
export const USE_PAGINATED_DATA_FRESH_ID = 'fresh';
export const USE_PAGINATED_DATA_PAGE_COUNT = 2;

const createDeferred = <T,>(): { promise: Promise<T>; resolve: (value: T) => void } => {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>(resolver => {
        resolve = resolver;
    });

    return {
        promise,
        resolve
    };
};

describe('usePaginatedData', (): void => {
    it('aborts stale reloads and keeps the latest response', async (): Promise<void> => {
        const requests: Array<{
            resolve: (value: {
                items: TestItem[];
                meta: TestMeta;
                pagination_info: { page_count: number };
            }) => void;
            signal?: AbortSignal;
        }> = [];

        const loader = vi.fn(
            (
                _page: number,
                signal?: AbortSignal
            ): Promise<{
                items: TestItem[];
                meta: TestMeta;
                pagination_info: { page_count: number };
            }> => {
                const deferred = createDeferred<{
                    items: TestItem[];
                    meta: TestMeta;
                    pagination_info: { page_count: number };
                }>();
                requests.push({ resolve: deferred.resolve, signal });
                return deferred.promise;
            }
        );

        const { result } = renderHook(
            (): UsePaginatedDataResult<TestItem, TestMeta> =>
                usePaginatedData<TestItem, TestMeta>({
                    enabled: true,
                    loader
                })
        );

        await waitFor((): void => {
            expect(loader).toHaveBeenCalledTimes(1);
        });

        act((): void => {
            result.current.reload();
        });

        await waitFor((): void => {
            expect(loader).toHaveBeenCalledTimes(2);
        });

        expect(requests[0].signal?.aborted).toBe(true);

        act((): void => {
            requests[0].resolve({
                items: [{ id: USE_PAGINATED_DATA_STALE_ID }],
                meta: { title: USE_PAGINATED_DATA_STALE_ID },
                pagination_info: { page_count: USE_PAGINATED_DATA_PAGE_COUNT }
            });
        });

        await Promise.resolve();

        expect(result.current.meta).toBeNull();
        expect(result.current.items).toEqual([]);

        act((): void => {
            requests[1].resolve({
                items: [{ id: USE_PAGINATED_DATA_FRESH_ID }],
                meta: { title: USE_PAGINATED_DATA_FRESH_ID },
                pagination_info: { page_count: USE_PAGINATED_DATA_PAGE_COUNT }
            });
        });

        await waitFor((): void => {
            expect(result.current.meta).toEqual({ title: USE_PAGINATED_DATA_FRESH_ID });
        });

        expect(result.current.items).toEqual([{ id: USE_PAGINATED_DATA_FRESH_ID }]);
        expect(result.current.hasMore).toBe(true);
    });

    it('preloads cached next pages during initial load', async (): Promise<void> => {
        const loader = vi.fn(
            async (
                page: number
            ): Promise<{
                items: TestItem[];
                meta: TestMeta;
                pagination_info: { page_count: number };
            }> => {
                if (page === 0) {
                    return {
                        items: [{ id: 'p0' }],
                        meta: { title: 'meta' },
                        pagination_info: { page_count: 3 }
                    };
                }

                return {
                    items: [{ id: `p${page}` }],
                    meta: { title: 'meta' },
                    pagination_info: { page_count: 3 }
                };
            }
        );

        const isPageCached = vi.fn((page: number): boolean => page === 1);

        const { result } = renderHook(
            (): UsePaginatedDataResult<TestItem, TestMeta> =>
                usePaginatedData<TestItem, TestMeta>({
                    enabled: true,
                    loader,
                    isPageCached
                })
        );

        await waitFor((): void => {
            expect(result.current.isInitialLoading).toBe(false);
        });

        expect(loader).toHaveBeenCalledTimes(2);
        expect(loader).toHaveBeenNthCalledWith(1, 0, expect.any(AbortSignal));
        expect(loader).toHaveBeenNthCalledWith(2, 1, expect.any(AbortSignal));
        expect(isPageCached).toHaveBeenCalledWith(1);
        expect(isPageCached).toHaveBeenCalledWith(2);
        expect(result.current.items).toEqual([{ id: 'p0' }, { id: 'p1' }]);
        expect(result.current.hasMore).toBe(true);
    });
});
