import type { ReactNode } from 'react';
import type { JSX } from 'react';
import { EmptyState, ErrorState, LoadingState } from '../common/AsyncState';
import { SearchInput } from './SearchInput';
import { EventGroupGrid } from '../EventGroupGrid/EventGroupGrid';
import type { ApiEventGroup } from '../../types/api';

export const DEFAULT_LOADING_TEXT = 'Wyszukiwanie...';
export const DEFAULT_EMPTY_TEXT = 'Brak wyników wyszukiwania.';

interface InnerSearchContainerProps {
    query: string;
    onQueryChange: (nextQuery: string) => void;
    placeholder: string;
    isSearchActive: boolean;
    isSearchLoading: boolean;
    searchError: string | null;
    onRetrySearch: () => void;
    searchEventGroups: ApiEventGroup[] | null;
    getSearchLink: (group: ApiEventGroup) => string;
    searchLoadingText?: string;
    emptySearchText?: string;
    children: ReactNode;
}

export const InnerSearchContainer = ({
    query,
    onQueryChange,
    placeholder,
    isSearchActive,
    isSearchLoading,
    searchError,
    onRetrySearch,
    searchEventGroups,
    getSearchLink,
    searchLoadingText = DEFAULT_LOADING_TEXT,
    emptySearchText = DEFAULT_EMPTY_TEXT,
    children
}: InnerSearchContainerProps): JSX.Element => {
    const searchInput = (
        <SearchInput query={query} onChange={onQueryChange} placeholder={placeholder} />
    );

    if (!isSearchActive) {
        return (
            <>
                {searchInput}
                {children}
            </>
        );
    }

    return (
        <>
            {searchInput}
            {isSearchLoading ? <LoadingState text={searchLoadingText} /> : null}
            {searchError ? <ErrorState message={searchError} onRetry={onRetrySearch} /> : null}
            {!isSearchLoading && !searchError && (searchEventGroups?.length ?? 0) === 0 ? (
                <EmptyState text={emptySearchText} />
            ) : null}
            {!isSearchLoading && !searchError && (searchEventGroups?.length ?? 0) > 0 ? (
                <EventGroupGrid eventGroups={searchEventGroups ?? []} getLink={getSearchLink} />
            ) : null}
        </>
    );
};
