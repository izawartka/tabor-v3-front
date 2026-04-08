import { screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import type { ApiSearchResponse } from '../../types/api';
import {
    YEARS_PAGE_EMPTY_TEXT,
    YEARS_PAGE_LOADING_TEXT,
    YEARS_PAGE_PLACEHOLDER,
    YearsPage
} from '../YearsPage';
import { renderWithTheme } from '../../test/renderWithTheme';
import { createSearchResponse } from '../../test/factories/api';

const mockSearchContainer = vi.hoisted(() => vi.fn());

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

vi.mock('../YearsPageContent', () => ({
    YearsPageContent: (): ReactElement => <div>years-page-content</div>
}));

import { searchDates } from '../../services/apiService';

describe('YearsPage', (): void => {
    beforeEach((): void => {
        vi.clearAllMocks();
    });

    it('passes mapped props to search container', async (): Promise<void> => {
        vi.mocked(searchDates).mockResolvedValue(createSearchResponse());

        renderWithTheme(<YearsPage />);

        expect(mockSearchContainer).toHaveBeenCalledTimes(1);
        const props = mockSearchContainer.mock.calls[0][0] as {
            placeholder: string;
            searchLoader: (query: string, signal?: AbortSignal) => Promise<ApiSearchResponse>;
            getSearchLink: (group: { id: string }) => string;
            searchLoadingText?: string;
            emptySearchText?: string;
        };

        expect(props.placeholder).toBe(YEARS_PAGE_PLACEHOLDER);
        expect(props.searchLoadingText).toBe(YEARS_PAGE_LOADING_TEXT);
        expect(props.emptySearchText).toBe(YEARS_PAGE_EMPTY_TEXT);
        expect(props.getSearchLink({ id: '2025.01.02' })).toBe('/date/2025.01.02');

        const controller = new AbortController();
        await props.searchLoader('2025.01', controller.signal);
        expect(searchDates).toHaveBeenCalledWith('2025.01', controller.signal);

        expect(screen.getByTestId('search-container')).toBeInTheDocument();
        expect(screen.getByText('years-page-content')).toBeInTheDocument();
    });
});
