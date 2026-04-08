import { useCallback } from 'react';
import type { JSX } from 'react';
import { searchLocos } from '../services/apiService';
import type { ApiSearchResponse } from '../types/api';
import { TypesPageContent } from './TypesPageContent';
import { SearchContainer } from '../components/SearchContainer/SearchContainer';

export const TYPES_PAGE_PLACEHOLDER = 'Wyszukaj pojazd...';
export const TYPES_PAGE_LOADING_TEXT = 'Wyszukiwanie pojazdów...';
export const TYPES_PAGE_EMPTY_TEXT = 'Brak wyników wyszukiwania.';

export const TypesPage = (): JSX.Element => {
    const searchLoader = useCallback(
        (query: string, signal?: AbortSignal): Promise<ApiSearchResponse> =>
            searchLocos(query, signal),
        []
    );

    return (
        <SearchContainer
            placeholder={TYPES_PAGE_PLACEHOLDER}
            searchLoader={searchLoader}
            getSearchLink={(group): string => `/loco/${group.id}`}
            searchLoadingText={TYPES_PAGE_LOADING_TEXT}
            emptySearchText={TYPES_PAGE_EMPTY_TEXT}
        >
            <TypesPageContent />
        </SearchContainer>
    );
};
