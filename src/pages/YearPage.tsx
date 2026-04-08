import { useCallback } from 'react';
import type { JSX } from 'react';
import { useParams } from 'react-router-dom';
import { searchDates } from '../services/apiService';
import type { ApiEventGroupListResponse } from '../types/api';
import { YearPageContent } from './YearPageContent';
import { SearchContainer } from '../components/SearchContainer/SearchContainer';

export const YEAR_PAGE_PLACEHOLDER = 'Wyszukaj datę...';
export const YEAR_PAGE_LOADING_TEXT = 'Wyszukiwanie dat...';
export const YEAR_PAGE_EMPTY_TEXT = 'Brak wyników wyszukiwania.';

export const YearPage = (): JSX.Element => {
    const { year = '' } = useParams();

    const searchLoader = useCallback(
        (query: string, signal?: AbortSignal): Promise<ApiEventGroupListResponse> =>
            searchDates(query, signal),
        []
    );

    return (
        <SearchContainer
            placeholder={YEAR_PAGE_PLACEHOLDER}
            searchLoader={searchLoader}
            getSearchLink={(group): string => `/date/${group.id}`}
            searchLoadingText={YEAR_PAGE_LOADING_TEXT}
            emptySearchText={YEAR_PAGE_EMPTY_TEXT}
        >
            <YearPageContent year={year} />
        </SearchContainer>
    );
};
