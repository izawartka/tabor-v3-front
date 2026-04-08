import type { JSX } from 'react';
import { SEARCH_MIN_QUERY_LENGTH } from '../../utils/search';
import { useSearchQuery } from '../../hooks/query/useSearchQuery';
import { useEventGroupSearch } from '../../hooks/query/useEventGroupSearch';
import { InnerSearchContainer } from './InnerSearchContainer';
import type { ApiSearchResponse } from '../../types/api';

export interface SearchContainerProps {
    placeholder: string;
    searchLoader: (query: string, signal?: AbortSignal) => Promise<ApiSearchResponse>;
    getSearchLink: (group: { id: string }) => string;
    searchLoadingText?: string;
    emptySearchText?: string;
    minQueryLength?: number;
    children: React.ReactNode;
}

export const SearchContainer = ({
    placeholder,
    searchLoader,
    getSearchLink,
    searchLoadingText,
    emptySearchText,
    minQueryLength = SEARCH_MIN_QUERY_LENGTH,
    children
}: SearchContainerProps): JSX.Element => {
    const { query, setQuery } = useSearchQuery();

    const {
        isActive: isSearchActive,
        data: searchData,
        isLoading: isSearchLoading,
        error: searchError,
        reload: reloadSearch
    } = useEventGroupSearch({
        query,
        minQueryLength: minQueryLength,
        loader: searchLoader
    });

    return (
        <InnerSearchContainer
            query={query}
            onQueryChange={setQuery}
            placeholder={placeholder}
            isSearchActive={isSearchActive}
            isSearchLoading={isSearchLoading}
            searchError={searchError}
            onRetrySearch={reloadSearch}
            searchEventGroups={searchData?.event_groups ?? null}
            getSearchLink={getSearchLink}
            searchLoadingText={searchLoadingText}
            emptySearchText={emptySearchText}
        >
            {children}
        </InnerSearchContainer>
    );
};
