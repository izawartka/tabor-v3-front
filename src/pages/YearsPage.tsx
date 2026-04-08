import { useCallback } from 'react';
import type { JSX } from 'react';
import { searchDates } from '../services/apiService';
import type { ApiSearchResponse } from '../types/api';
import { SearchContainer } from '../components/SearchContainer/SearchContainer';
import { YearsPageContent } from './YearsPageContent';

export const YEARS_PAGE_PLACEHOLDER = 'Wyszukaj datę...';
export const YEARS_PAGE_LOADING_TEXT = 'Wyszukiwanie dat...';
export const YEARS_PAGE_EMPTY_TEXT = 'Brak wyników wyszukiwania.';

export const YearsPage = (): JSX.Element => {
    const searchLoader = useCallback(
        (query: string, signal?: AbortSignal): Promise<ApiSearchResponse> =>
            searchDates(query, signal),
        []
    );

    return (
        <SearchContainer
            placeholder={YEARS_PAGE_PLACEHOLDER}
            searchLoader={searchLoader}
            getSearchLink={(group): string => `/date/${group.id}`}
            searchLoadingText={YEARS_PAGE_LOADING_TEXT}
            emptySearchText={YEARS_PAGE_EMPTY_TEXT}
        >
            <YearsPageContent />
        </SearchContainer>
    );
};
