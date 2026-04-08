import { screen } from '@testing-library/react';
import {
    YEAR_PAGE_CONTENT_EMPTY_TEXT,
    YEAR_PAGE_CONTENT_ERROR_TEXT,
    YEAR_PAGE_CONTENT_EVENT_COUNT_LABEL,
    YEAR_PAGE_CONTENT_LOADING_TEXT,
    YearPageContent
} from '../YearPageContent';
import { renderWithTheme } from '../../test/renderWithTheme';
import { createEventGroup, createSearchResponse } from '../../test/factories/api';

vi.mock('../../contexts/useRefreshTimestamp', () => ({
    useRefreshTimestamp: vi.fn(() => ({ refreshTimestamp: '1' }))
}));

vi.mock('../../hooks/data/useFetchedData', () => ({
    useFetchedData: vi.fn()
}));

import { useFetchedData } from '../../hooks/data/useFetchedData';

describe('YearPageContent', (): void => {
    it('renders loading, error, empty and data states', (): void => {
        vi.mocked(useFetchedData).mockReturnValue({
            data: null,
            isLoading: true,
            error: null,
            reload: vi.fn()
        });

        renderWithTheme(<YearPageContent year="2025" />);
        expect(screen.getByText(YEAR_PAGE_CONTENT_LOADING_TEXT)).toBeInTheDocument();

        vi.mocked(useFetchedData).mockReturnValue({
            data: null,
            isLoading: false,
            error: YEAR_PAGE_CONTENT_ERROR_TEXT,
            reload: vi.fn()
        });

        renderWithTheme(<YearPageContent year="2025" />);
        expect(screen.getByText(YEAR_PAGE_CONTENT_ERROR_TEXT)).toBeInTheDocument();

        vi.mocked(useFetchedData).mockReturnValue({
            data: {
                ...createSearchResponse({ event_groups: [] }),
                year_info: { year: '2025' }
            },
            isLoading: false,
            error: null,
            reload: vi.fn()
        });

        renderWithTheme(<YearPageContent year="2025" />);
        expect(screen.getByText('2025')).toBeInTheDocument();
        expect(screen.getByText(YEAR_PAGE_CONTENT_EVENT_COUNT_LABEL)).toBeInTheDocument();
        expect(screen.getByText(YEAR_PAGE_CONTENT_EMPTY_TEXT)).toBeInTheDocument();

        vi.mocked(useFetchedData).mockReturnValue({
            data: {
                ...createSearchResponse({
                    event_groups: [createEventGroup({ display_name: '2025.01.01' })]
                }),
                year_info: { year: '2025' }
            },
            isLoading: false,
            error: null,
            reload: vi.fn()
        });

        renderWithTheme(<YearPageContent year="2025" />);
        expect(screen.getByText('2025.01.01')).toBeInTheDocument();
    });
});
