import { screen } from '@testing-library/react';
import {
    PLACES_PAGE_CONTENT_EMPTY_TEXT,
    PLACES_PAGE_CONTENT_ERROR_TEXT,
    PLACES_PAGE_CONTENT_LOADING_TEXT,
    PlacesPageContent
} from '../PlacesPageContent';
import { renderWithTheme } from '../../test/renderWithTheme';
import { createEventGroup, createSearchResponse } from '../../test/factories/api';

vi.mock('../../contexts/useRefreshTimestamp', () => ({
    useRefreshTimestamp: vi.fn(() => ({ refreshTimestamp: '1' }))
}));

vi.mock('../../hooks/data/useFetchedData', () => ({
    useFetchedData: vi.fn()
}));

import { useFetchedData } from '../../hooks/data/useFetchedData';

describe('PlacesPageContent', (): void => {
    it('renders loading, error, empty and data states', (): void => {
        vi.mocked(useFetchedData).mockReturnValue({
            data: null,
            isLoading: true,
            error: null,
            reload: vi.fn()
        });

        renderWithTheme(<PlacesPageContent />);
        expect(screen.getByText(PLACES_PAGE_CONTENT_LOADING_TEXT)).toBeInTheDocument();

        vi.mocked(useFetchedData).mockReturnValue({
            data: null,
            isLoading: false,
            error: PLACES_PAGE_CONTENT_ERROR_TEXT,
            reload: vi.fn()
        });

        renderWithTheme(<PlacesPageContent />);
        expect(screen.getByText(PLACES_PAGE_CONTENT_ERROR_TEXT)).toBeInTheDocument();

        vi.mocked(useFetchedData).mockReturnValue({
            data: createSearchResponse({ event_groups: [] }),
            isLoading: false,
            error: null,
            reload: vi.fn()
        });

        renderWithTheme(<PlacesPageContent />);
        expect(screen.getByText(PLACES_PAGE_CONTENT_EMPTY_TEXT)).toBeInTheDocument();

        vi.mocked(useFetchedData).mockReturnValue({
            data: createSearchResponse({
                event_groups: [createEventGroup({ display_name: 'Poznań Główny' })]
            }),
            isLoading: false,
            error: null,
            reload: vi.fn()
        });

        renderWithTheme(<PlacesPageContent />);
        expect(screen.getByText('Poznań Główny')).toBeInTheDocument();
    });
});
