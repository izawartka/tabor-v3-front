import { useCallback } from 'react';
import type { JSX } from 'react';
import { useParams } from 'react-router-dom';
import { SearchContainer } from '../components/SearchContainer/SearchContainer';
import { SEARCH_MIN_QUERY_LENGTH } from '../utils/search';
import { useEventGroupSearch } from '../hooks/query/useEventGroupSearch';
import { useSearchQuery } from '../hooks/query/useSearchQuery';
import { searchLocos } from '../services/apiService';
import type { ApiEventGroupListResponse } from '../types/api';
import { TypePageContent } from './TypePageContent';

export const TYPE_PAGE_PLACEHOLDER = 'Wyszukaj pojazd...';
export const TYPE_PAGE_LOADING_TEXT = 'Wyszukiwanie pojazdów...';
export const TYPE_PAGE_EMPTY_TEXT = 'Brak wyników wyszukiwania.';

export const TypePage = (): JSX.Element => {
    const { id = '' } = useParams();
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
            placeholder={TYPE_PAGE_PLACEHOLDER}
            isSearchActive={isSearchActive}
            isSearchLoading={isSearchLoading}
            searchError={searchError}
            onRetrySearch={reloadSearch}
            searchEventGroups={searchData?.event_groups ?? null}
            getSearchLink={group => `/loco/${encodeURIComponent(group.id)}`}
            searchLoadingText={TYPE_PAGE_LOADING_TEXT}
            emptySearchText={TYPE_PAGE_EMPTY_TEXT}
        >
            <TypePageContent typeId={id} />
        </SearchContainer>
    );
};
