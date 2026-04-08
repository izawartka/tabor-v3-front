import { screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import type { ApiSearchResponse } from '../../types/api';
import { TYPE_PAGE_PLACEHOLDER, TypePage } from '../TypePage';
import { renderWithTheme } from '../../test/renderWithTheme';
import { createSearchResponse } from '../../test/factories/api';

const mockSearchContainer = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useParams: vi.fn(() => ({ id: 'type-1' }))
    };
});

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

vi.mock('../TypePageContent', () => ({
    TypePageContent: ({ typeId }: { typeId: string }): ReactElement => (
        <div>type-content-{typeId}</div>
    )
}));

import { searchLocos } from '../../services/apiService';

describe('TypePage', (): void => {
    beforeEach((): void => {
        vi.clearAllMocks();
    });

    it('passes mapped props to search container and renders nested type content', async (): Promise<void> => {
        vi.mocked(searchLocos).mockResolvedValue(createSearchResponse());

        renderWithTheme(<TypePage />);

        expect(mockSearchContainer).toHaveBeenCalledTimes(1);
        const props = mockSearchContainer.mock.calls[0][0] as {
            placeholder: string;
            searchLoader: (query: string, signal?: AbortSignal) => Promise<ApiSearchResponse>;
            getSearchLink: (group: { id: string }) => string;
            searchLoadingText?: string;
            emptySearchText?: string;
        };

        expect(props.placeholder).toBe(TYPE_PAGE_PLACEHOLDER);
        expect(props.getSearchLink({ id: 'abc' })).toBe('/loco/abc');

        const controller = new AbortController();
        await props.searchLoader('ET22', controller.signal);
        expect(searchLocos).toHaveBeenCalledWith('ET22', controller.signal);

        expect(screen.getByText('type-content-type-1')).toBeInTheDocument();
    });
});
