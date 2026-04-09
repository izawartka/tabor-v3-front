import { screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import type { ApiSearchResponse } from '../../types/api';
import {
    PLACES_PAGE_EMPTY_TEXT,
    PLACES_PAGE_LOADING_TEXT,
    PLACES_PAGE_PLACEHOLDER,
    PlacesPage
} from '../PlacesPage';
import { renderWithTheme } from '../../test/renderWithTheme';
import { createSearchResponse } from '../../test/factories/api';

const mockSearchContainer = vi.hoisted(() => vi.fn());

vi.mock('../../services/apiService', () => ({
    searchPlaces: vi.fn()
}));

vi.mock('../../components/SearchContainer/SearchContainer', () => ({
    SearchContainer: (props: {
        placeholder: string;
        searchLoader: (query: string, signal?: AbortSignal) => Promise<ApiSearchResponse>;
        getSearchLink: (group: { id: string }) => string;
        searchLoadingText?: string;
        emptySearchText?: string;
        children: React.ReactNode;
    }): ReactElement => {
        mockSearchContainer(props);
        return <div data-testid="search-container">{props.children}</div>;
    }
}));

vi.mock('../PlacesPageContent', () => ({
    PlacesPageContent: (): ReactElement => <div>places-page-content</div>
}));

import { searchPlaces } from '../../services/apiService';

describe('PlacesPage', (): void => {
    beforeEach((): void => {
        vi.clearAllMocks();
    });

    it('passes mapped props to search container', async (): Promise<void> => {
        vi.mocked(searchPlaces).mockResolvedValue(createSearchResponse());

        renderWithTheme(<PlacesPage />);

        expect(mockSearchContainer).toHaveBeenCalledTimes(1);
        const props = mockSearchContainer.mock.calls[0][0] as {
            placeholder: string;
            searchLoader: (query: string, signal?: AbortSignal) => Promise<ApiSearchResponse>;
            getSearchLink: (group: { id: string }) => string;
            searchLoadingText?: string;
            emptySearchText?: string;
        };

        expect(props.placeholder).toBe(PLACES_PAGE_PLACEHOLDER);
        expect(props.searchLoadingText).toBe(PLACES_PAGE_LOADING_TEXT);
        expect(props.emptySearchText).toBe(PLACES_PAGE_EMPTY_TEXT);
        expect(props.getSearchLink({ id: 'poznań_główny' })).toBe('/place/poznań_główny');

        const controller = new AbortController();
        await props.searchLoader('Poznań', controller.signal);
        expect(searchPlaces).toHaveBeenCalledWith('Poznań', controller.signal);

        expect(screen.getByTestId('search-container')).toBeInTheDocument();
        expect(screen.getByText('places-page-content')).toBeInTheDocument();
    });
});
