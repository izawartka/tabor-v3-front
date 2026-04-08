import { renderHook, act } from '@testing-library/react';
import type { Mock } from 'vitest';
import { normalizeSearchQuery } from '../../../utils/search';
import { useSearchQuery } from '../useSearchQuery';
import { useUrlQueryParam } from '../useUrlQueryParam';

export const USE_SEARCH_QUERY_CURRENT_VALUE = '  aktualny  ';
export const USE_SEARCH_QUERY_NEXT_VALUE = '  nowy wpis  ';
export const USE_SEARCH_QUERY_PUSH_VALUE = 'pociąg';
export const USE_SEARCH_QUERY_NORMALIZED_VALUE = 'aktualny';

vi.mock('../useUrlQueryParam', (): { useUrlQueryParam: Mock } => ({
    useUrlQueryParam: vi.fn()
}));

describe('useSearchQuery', (): void => {
    beforeEach((): void => {
        vi.clearAllMocks();
    });

    it('normalizes query values before writing them to the URL', (): void => {
        const setUrlQuery = vi.fn();
        vi.mocked(useUrlQueryParam).mockReturnValue([USE_SEARCH_QUERY_CURRENT_VALUE, setUrlQuery]);

        const { result } = renderHook(() => useSearchQuery());

        act((): void => {
            result.current.setQuery(USE_SEARCH_QUERY_NEXT_VALUE);
        });

        expect(setUrlQuery).toHaveBeenCalledWith(USE_SEARCH_QUERY_NEXT_VALUE, {
            replace: true,
            normalizeValue: normalizeSearchQuery
        });
    });

    it('pushes history when search state changes between empty and non-empty', (): void => {
        const setUrlQuery = vi.fn();
        vi.mocked(useUrlQueryParam).mockReturnValue(['', setUrlQuery]);

        const { result } = renderHook(() => useSearchQuery());

        act((): void => {
            result.current.setQuery(USE_SEARCH_QUERY_PUSH_VALUE);
        });

        expect(setUrlQuery).toHaveBeenCalledWith(USE_SEARCH_QUERY_PUSH_VALUE, {
            replace: false,
            normalizeValue: normalizeSearchQuery
        });
    });

    it('supports custom query param key', (): void => {
        const setUrlQuery = vi.fn();
        vi.mocked(useUrlQueryParam).mockReturnValue(['value', setUrlQuery]);

        const { result } = renderHook(() => useSearchQuery({ queryParamKey: 'custom' }));

        expect(vi.mocked(useUrlQueryParam)).toHaveBeenCalledWith('custom');

        act((): void => {
            result.current.setQuery('next');
        });

        expect(setUrlQuery).toHaveBeenCalled();
    });
});
