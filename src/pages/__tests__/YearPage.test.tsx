import { screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import type { ApiSearchResponse } from '../../types/api';
import {
    YEAR_PAGE_EMPTY_TEXT,
    YEAR_PAGE_LOADING_TEXT,
    YEAR_PAGE_PLACEHOLDER,
    YearPage
} from '../YearPage';
import { renderWithTheme } from '../../test/renderWithTheme';
import { createSearchResponse } from '../../test/factories/api';

const mockSearchContainer = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useParams: vi.fn(() => ({ year: '2025' }))
    };
});

vi.mock('../../services/apiService', () => ({
    searchDates: vi.fn()
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

vi.mock('../YearPageContent', () => ({
    YearPageContent: ({ year }: { year: string }): ReactElement => <div>year-content-{year}</div>
}));

import { searchDates } from '../../services/apiService';

describe('YearPage', (): void => {
    beforeEach((): void => {
        vi.clearAllMocks();
    });

    it('passes mapped props to search container and renders year content', async (): Promise<void> => {
        vi.mocked(searchDates).mockResolvedValue(createSearchResponse());

        renderWithTheme(<YearPage />);

        expect(mockSearchContainer).toHaveBeenCalledTimes(1);
        const props = mockSearchContainer.mock.calls[0][0] as {
            placeholder: string;
            searchLoader: (query: string, signal?: AbortSignal) => Promise<ApiSearchResponse>;
            getSearchLink: (group: { id: string }) => string;
            searchLoadingText?: string;
            emptySearchText?: string;
        };

        expect(props.placeholder).toBe(YEAR_PAGE_PLACEHOLDER);
        expect(props.searchLoadingText).toBe(YEAR_PAGE_LOADING_TEXT);
        expect(props.emptySearchText).toBe(YEAR_PAGE_EMPTY_TEXT);
        expect(props.getSearchLink({ id: '2025.01.02' })).toBe('/date/2025.01.02');

        const controller = new AbortController();
        await props.searchLoader('2025.01', controller.signal);
        expect(searchDates).toHaveBeenCalledWith('2025.01', controller.signal);

        expect(screen.getByText('year-content-2025')).toBeInTheDocument();
    });
});
