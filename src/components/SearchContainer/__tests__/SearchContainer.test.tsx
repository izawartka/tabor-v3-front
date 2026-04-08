import { screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { SearchContainer } from '../SearchContainer';
import { SEARCH_MIN_QUERY_LENGTH } from '../../../utils/search';
import { renderWithTheme } from '../../../test/renderWithTheme';
import { createSearchResponse } from '../../../test/factories/api';
import type { ApiSearchResponse } from '../../../types/api';

const mockUseSearchQuery = vi.hoisted(() => vi.fn());
const mockUseEventGroupSearch = vi.hoisted(() => vi.fn());
const mockInnerSearchContainer = vi.hoisted(() => vi.fn());

vi.mock('../../../hooks/query/useSearchQuery', () => ({
    useSearchQuery: (): ReturnType<typeof mockUseSearchQuery> => mockUseSearchQuery()
}));

vi.mock('../../../hooks/query/useEventGroupSearch', () => ({
    useEventGroupSearch: (options: unknown): ReturnType<typeof mockUseEventGroupSearch> =>
        mockUseEventGroupSearch(options)
}));

vi.mock('../InnerSearchContainer', () => ({
    InnerSearchContainer: (props: {
        query: string;
        onQueryChange: (nextQuery: string) => void;
        placeholder: string;
        isSearchActive: boolean;
        isSearchLoading: boolean;
        searchError: string | null;
        onRetrySearch: () => void;
        searchEventGroups: Array<{
            id: string;
            display_name: string;
            event_count: number;
            thumb: string | null;
        }> | null;
        getSearchLink: (group: { id: string }) => string;
        searchLoadingText?: string;
        emptySearchText?: string;
        children: React.ReactNode;
    }): ReactElement => {
        mockInnerSearchContainer(props);
        return <div data-testid="inner-search-container">{props.children}</div>;
    }
}));

describe('SearchContainer', (): void => {
    beforeEach((): void => {
        vi.clearAllMocks();
    });

    it('maps hook state and props to InnerSearchContainer', (): void => {
        const setQuery = vi.fn();
        const reload = vi.fn();
        const data = createSearchResponse();
        const searchLoader =
            vi.fn<(query: string, signal?: AbortSignal) => Promise<ApiSearchResponse>>();

        mockUseSearchQuery.mockReturnValue({ query: 'ET22', setQuery });
        mockUseEventGroupSearch.mockReturnValue({
            normalizedQuery: 'ET22',
            isActive: true,
            data,
            isLoading: false,
            error: null,
            reload
        });

        renderWithTheme(
            <SearchContainer
                placeholder="Szukaj"
                searchLoader={searchLoader}
                getSearchLink={(group): string => `/loco/${group.id}`}
                searchLoadingText="Ładowanie"
                emptySearchText="Brak"
            >
                <div>content</div>
            </SearchContainer>
        );

        expect(mockUseEventGroupSearch).toHaveBeenCalledWith({
            query: 'ET22',
            minQueryLength: SEARCH_MIN_QUERY_LENGTH,
            loader: searchLoader
        });

        expect(mockInnerSearchContainer).toHaveBeenCalledTimes(1);
        const props = mockInnerSearchContainer.mock.calls[0][0] as {
            query: string;
            onQueryChange: (nextQuery: string) => void;
            isSearchActive: boolean;
            isSearchLoading: boolean;
            searchError: string | null;
            onRetrySearch: () => void;
            searchEventGroups: Array<{ id: string }> | null;
            searchLoadingText?: string;
            emptySearchText?: string;
        };

        expect(props.query).toBe('ET22');
        expect(props.onQueryChange).toBe(setQuery);
        expect(props.isSearchActive).toBe(true);
        expect(props.isSearchLoading).toBe(false);
        expect(props.searchError).toBeNull();
        expect(props.onRetrySearch).toBe(reload);
        expect(props.searchEventGroups).toEqual(data.event_groups);
        expect(props.searchLoadingText).toBe('Ładowanie');
        expect(props.emptySearchText).toBe('Brak');

        expect(screen.getByTestId('inner-search-container')).toBeInTheDocument();
        expect(screen.getByText('content')).toBeInTheDocument();
    });

    it('passes custom minQueryLength to useEventGroupSearch', (): void => {
        mockUseSearchQuery.mockReturnValue({ query: 'abc', setQuery: vi.fn() });
        mockUseEventGroupSearch.mockReturnValue({
            normalizedQuery: 'abc',
            isActive: true,
            data: null,
            isLoading: false,
            error: null,
            reload: vi.fn()
        });

        const searchLoader =
            vi.fn<(query: string, signal?: AbortSignal) => Promise<ApiSearchResponse>>();

        renderWithTheme(
            <SearchContainer
                placeholder="Szukaj"
                searchLoader={searchLoader}
                getSearchLink={(group): string => `/loco/${group.id}`}
                minQueryLength={5}
            >
                <div>content</div>
            </SearchContainer>
        );

        expect(mockUseEventGroupSearch).toHaveBeenCalledWith({
            query: 'abc',
            minQueryLength: 5,
            loader: searchLoader
        });
    });

    it('passes null groups when hook data is null', (): void => {
        mockUseSearchQuery.mockReturnValue({ query: '', setQuery: vi.fn() });
        mockUseEventGroupSearch.mockReturnValue({
            normalizedQuery: '',
            isActive: false,
            data: null,
            isLoading: false,
            error: null,
            reload: vi.fn()
        });

        const searchLoader =
            vi.fn<(query: string, signal?: AbortSignal) => Promise<ApiSearchResponse>>();

        renderWithTheme(
            <SearchContainer
                placeholder="Szukaj"
                searchLoader={searchLoader}
                getSearchLink={(group): string => `/loco/${group.id}`}
            >
                <div>content</div>
            </SearchContainer>
        );

        const props = mockInnerSearchContainer.mock.calls[0][0] as {
            searchEventGroups: Array<{ id: string }> | null;
        };

        expect(props.searchEventGroups).toBeNull();
    });
});
