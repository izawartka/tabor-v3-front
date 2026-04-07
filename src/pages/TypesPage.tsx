import { useCallback } from 'react';
import type { JSX } from 'react';
import { SearchContainer } from '../components/SearchContainer/SearchContainer';
import { SEARCH_MIN_QUERY_LENGTH } from '../utils/search';
import { useEventGroupSearch } from '../hooks/query/useEventGroupSearch';
import { useSearchQuery } from '../hooks/query/useSearchQuery';
import { searchLocos } from '../services/apiService';
import type { ApiEventGroupListResponse } from '../types/api';
import { TypesPageContent } from './TypesPageContent';

export const TYPES_PAGE_PLACEHOLDER = 'Wyszukaj pojazd...';
export const TYPES_PAGE_LOADING_TEXT = 'Wyszukiwanie pojazdów...';
export const TYPES_PAGE_EMPTY_TEXT = 'Brak wyników wyszukiwania.';

export const TypesPage = (): JSX.Element => {
    const { query, setQuery } = useSearchQuery();

    const searchLoader = useCallback(
        (query: string, signal?: AbortSignal): Promise<ApiEventGroupListResponse> =>
            searchLocos(query, signal),
        []
    );

    const {
        isActive: isSearchActive,
        data: searchData,
        isLoading: isSearchLoading,
        error: searchError,
        reload: reloadSearch
    } = useEventGroupSearch({
        query,
        minQueryLength: SEARCH_MIN_QUERY_LENGTH,
        loader: searchLoader
    });

    return (
        <SearchContainer
            query={query}
            onQueryChange={setQuery}
            placeholder={TYPES_PAGE_PLACEHOLDER}
            isSearchActive={isSearchActive}
            isSearchLoading={isSearchLoading}
            searchError={searchError}
            onRetrySearch={reloadSearch}
            searchEventGroups={searchData?.event_groups ?? null}
            getSearchLink={group => `/loco/${encodeURIComponent(group.id)}`}
            searchLoadingText={TYPES_PAGE_LOADING_TEXT}
            emptySearchText={TYPES_PAGE_EMPTY_TEXT}
        >
            <TypesPageContent />
        </SearchContainer>
    );
};
