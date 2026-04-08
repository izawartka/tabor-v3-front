import { screen } from '@testing-library/react';
import {
    YEARS_PAGE_CONTENT_EMPTY_TEXT,
    YEARS_PAGE_CONTENT_ERROR_TEXT,
    YEARS_PAGE_CONTENT_LOADING_TEXT,
    YearsPageContent
} from '../YearsPageContent';
import { renderWithTheme } from '../../test/renderWithTheme';
import { createEventGroup, createSearchResponse } from '../../test/factories/api';

vi.mock('../../contexts/useRefreshTimestamp', () => ({
    useRefreshTimestamp: vi.fn(() => ({ refreshTimestamp: '1' }))
}));

vi.mock('../../hooks/data/useFetchedData', () => ({
    useFetchedData: vi.fn()
}));

import { useFetchedData } from '../../hooks/data/useFetchedData';

describe('YearsPageContent', (): void => {
    it('renders loading, error, empty and data states', (): void => {
        vi.mocked(useFetchedData).mockReturnValue({
            data: null,
            isLoading: true,
            error: null,
            reload: vi.fn()
        });

        renderWithTheme(<YearsPageContent />);
        expect(screen.getByText(YEARS_PAGE_CONTENT_LOADING_TEXT)).toBeInTheDocument();

        vi.mocked(useFetchedData).mockReturnValue({
            data: null,
            isLoading: false,
            error: YEARS_PAGE_CONTENT_ERROR_TEXT,
            reload: vi.fn()
        });

        renderWithTheme(<YearsPageContent />);
        expect(screen.getByText(YEARS_PAGE_CONTENT_ERROR_TEXT)).toBeInTheDocument();

        vi.mocked(useFetchedData).mockReturnValue({
            data: createSearchResponse({ event_groups: [] }),
            isLoading: false,
            error: null,
            reload: vi.fn()
        });

        renderWithTheme(<YearsPageContent />);
        expect(screen.getByText(YEARS_PAGE_CONTENT_EMPTY_TEXT)).toBeInTheDocument();

        vi.mocked(useFetchedData).mockReturnValue({
            data: createSearchResponse({
                event_groups: [createEventGroup({ display_name: '2025' })]
            }),
            isLoading: false,
            error: null,
            reload: vi.fn()
        });

        renderWithTheme(<YearsPageContent />);
        expect(screen.getByText('2025')).toBeInTheDocument();
    });
});
