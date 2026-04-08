import { screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import type { ApiSearchResponse } from '../../types/api';
import {
    TYPES_PAGE_EMPTY_TEXT,
    TYPES_PAGE_LOADING_TEXT,
    TYPES_PAGE_PLACEHOLDER,
    TypesPage
} from '../TypesPage';
import { renderWithTheme } from '../../test/renderWithTheme';
import { createSearchResponse } from '../../test/factories/api';

const mockSearchContainer = vi.hoisted(() => vi.fn());

vi.mock('../../services/apiService', () => ({
    searchLocos: vi.fn()
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

vi.mock('../TypesPageContent', () => ({
    TypesPageContent: (): ReactElement => <div>types-page-content</div>
}));

import { searchLocos } from '../../services/apiService';

describe('TypesPage', (): void => {
    beforeEach((): void => {
        vi.clearAllMocks();
    });

    it('passes mapped props to search container', async (): Promise<void> => {
        vi.mocked(searchLocos).mockResolvedValue(createSearchResponse());

        renderWithTheme(<TypesPage />);

        expect(mockSearchContainer).toHaveBeenCalledTimes(1);
        const props = mockSearchContainer.mock.calls[0][0] as {
            placeholder: string;
            searchLoader: (query: string, signal?: AbortSignal) => Promise<ApiSearchResponse>;
            getSearchLink: (group: { id: string }) => string;
            searchLoadingText?: string;
            emptySearchText?: string;
        };

        expect(props.placeholder).toBe(TYPES_PAGE_PLACEHOLDER);
        expect(props.searchLoadingText).toBe(TYPES_PAGE_LOADING_TEXT);
        expect(props.emptySearchText).toBe(TYPES_PAGE_EMPTY_TEXT);
        expect(props.getSearchLink({ id: 'abc' })).toBe('/loco/abc');

        const controller = new AbortController();
        await props.searchLoader('ET41', controller.signal);
        expect(searchLocos).toHaveBeenCalledWith('ET41', controller.signal);

        expect(screen.getByTestId('search-container')).toBeInTheDocument();
        expect(screen.getByText('types-page-content')).toBeInTheDocument();
    });
});
