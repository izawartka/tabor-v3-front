import { useCallback } from 'react';
import type { JSX } from 'react';
import { useParams } from 'react-router-dom';
import { searchLocos } from '../services/apiService';
import type { ApiEventGroupListResponse } from '../types/api';
import { TypePageContent } from './TypePageContent';
import { SearchContainer } from '../components/SearchContainer/SearchContainer';

export const TYPE_PAGE_PLACEHOLDER = 'Wyszukaj pojazd...';
export const TYPE_PAGE_LOADING_TEXT = 'Wyszukiwanie pojazdów...';
export const TYPE_PAGE_EMPTY_TEXT = 'Brak wyników wyszukiwania.';

export const TypePage = (): JSX.Element => {
    const { id = '' } = useParams();

    const searchLoader = useCallback(
        (query: string, signal?: AbortSignal): Promise<ApiEventGroupListResponse> =>
            searchLocos(query, signal),
        []
    );

    return (
        <SearchContainer
            placeholder={TYPE_PAGE_PLACEHOLDER}
            searchLoader={searchLoader}
            getSearchLink={(group): string => `/loco/${group.id}`}
            searchLoadingText={TYPE_PAGE_LOADING_TEXT}
            emptySearchText={TYPE_PAGE_EMPTY_TEXT}
        >
            <TypePageContent typeId={id} />
        </SearchContainer>
    );
};
