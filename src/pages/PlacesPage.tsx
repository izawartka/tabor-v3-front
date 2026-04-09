import { useCallback } from 'react';
import type { JSX } from 'react';
import { searchPlaces } from '../services/apiService';
import type { ApiSearchResponse } from '../types/api';
import { SearchContainer } from '../components/SearchContainer/SearchContainer';
import { PlacesPageContent } from './PlacesPageContent';

export const PLACES_PAGE_PLACEHOLDER = 'Wyszukaj miejsce...';
export const PLACES_PAGE_LOADING_TEXT = 'Wyszukiwanie miejsc...';
export const PLACES_PAGE_EMPTY_TEXT = 'Brak wyników wyszukiwania.';

export const PlacesPage = (): JSX.Element => {
    const searchLoader = useCallback(
        (query: string, signal?: AbortSignal): Promise<ApiSearchResponse> =>
            searchPlaces(query, signal),
        []
    );

    return (
        <SearchContainer
            placeholder={PLACES_PAGE_PLACEHOLDER}
            searchLoader={searchLoader}
            getSearchLink={(group): string => `/place/${group.id}`}
            searchLoadingText={PLACES_PAGE_LOADING_TEXT}
            emptySearchText={PLACES_PAGE_EMPTY_TEXT}
        >
            <PlacesPageContent />
        </SearchContainer>
    );
};
