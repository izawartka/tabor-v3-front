import { act, renderHook, waitFor } from '@testing-library/react';
import { ApiError, HTTP_ERROR_GENERIC_MESSAGE } from '../../../services/httpService';
import { useFetchedData } from '../useFetchedData';

describe('useFetchedData', (): void => {
    it('loads data and supports reload', async (): Promise<void> => {
        const loader = vi
            .fn<(_signal?: AbortSignal) => Promise<{ value: number }>>()
            .mockResolvedValue({ value: 1 });

        const { result } = renderHook(() => useFetchedData({ loader }));

        await waitFor((): void => {
            expect(result.current.data).toEqual({ value: 1 });
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();

        act((): void => {
            result.current.reload();
        });

        await waitFor((): void => {
            expect(loader).toHaveBeenCalledTimes(2);
        });
    });

    it('maps ApiError and unknown errors', async (): Promise<void> => {
        const { result, rerender } = renderHook(
            ({ loader }) =>
                useFetchedData({
                    loader
                }),
            {
                initialProps: {
                    loader: vi.fn().mockRejectedValue(new ApiError('api'))
                }
            }
        );

        await waitFor((): void => {
            expect(result.current.error).toBe('api');
        });

        rerender({ loader: vi.fn().mockRejectedValue(new Error('x')) });

        await waitFor((): void => {
            expect(result.current.error).toBe(HTTP_ERROR_GENERIC_MESSAGE);
        });
    });
});
