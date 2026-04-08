import { act, renderHook, waitFor } from '@testing-library/react';
import { ApiError, HTTP_ERROR_GENERIC_MESSAGE } from '../../../services/httpService';
import { useEventGroupSearch } from '../useEventGroupSearch';
import { createSearchResponse } from '../../../test/factories/api';

describe('useEventGroupSearch', (): void => {
    it('is inactive for short query and does not call loader', (): void => {
        const loader = vi.fn();

        const { result } = renderHook(() =>
            useEventGroupSearch({
                query: 'ab',
                minQueryLength: 3,
                loader
            })
        );

        expect(result.current.isActive).toBe(false);
        expect(result.current.data).toBeNull();
        expect(loader).not.toHaveBeenCalled();
    });

    it('loads active query and supports reload', async (): Promise<void> => {
        const loader = vi.fn().mockResolvedValue(createSearchResponse());

        const { result } = renderHook(() =>
            useEventGroupSearch({
                query: '  ET22  ',
                minQueryLength: 3,
                loader
            })
        );

        await waitFor((): void => {
            expect(result.current.data).not.toBeNull();
        });

        expect(result.current.normalizedQuery).toBe('ET22');
        expect(loader).toHaveBeenCalledWith('ET22', expect.any(AbortSignal));

        act((): void => {
            result.current.reload();
        });

        await waitFor((): void => {
            expect(loader).toHaveBeenCalledTimes(2);
        });
    });

    it('maps ApiError and unknown errors', async (): Promise<void> => {
        const { result, rerender } = renderHook(
            ({ loader, query }) =>
                useEventGroupSearch({
                    query,
                    minQueryLength: 3,
                    loader
                }),
            {
                initialProps: {
                    loader: vi.fn().mockRejectedValue(new ApiError('api-error')),
                    query: 'abc'
                }
            }
        );

        await waitFor((): void => {
            expect(result.current.error).toBe('api-error');
        });

        rerender({ loader: vi.fn().mockRejectedValue(new Error('boom')), query: 'abcd' });

        await waitFor((): void => {
            expect(result.current.error).toBe(HTTP_ERROR_GENERIC_MESSAGE);
        });
    });
});
