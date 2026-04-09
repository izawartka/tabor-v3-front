import { screen } from '@testing-library/react';
import {
    PLACE_PAGE_EMPTY_TEXT,
    PLACE_PAGE_ERROR_TEXT,
    PLACE_PAGE_EVENT_COUNT_LABEL,
    PLACE_PAGE_INLINE_LOADING_TEXT,
    PLACE_PAGE_LOADING_TEXT,
    PlacePage
} from '../PlacePage';
import { renderWithTheme } from '../../test/renderWithTheme';
import { createMergedEvent } from '../../test/factories/api';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useParams: vi.fn(() => ({ id: 'poznań_główny' }))
    };
});

vi.mock('../../contexts/useRefreshTimestamp', () => ({
    useRefreshTimestamp: vi.fn(() => ({ refreshTimestamp: '1' }))
}));

vi.mock('../../hooks/data/usePaginatedData', () => ({
    usePaginatedData: vi.fn()
}));

vi.mock('../../hooks/scroll/useInfiniteScroll', () => ({
    useInfiniteScroll: vi.fn(() => ({ current: null }))
}));

import { usePaginatedData } from '../../hooks/data/usePaginatedData';

describe('PlacePage', (): void => {
    it('renders loading, error and content states', (): void => {
        vi.mocked(usePaginatedData).mockReturnValue({
            meta: null,
            items: [],
            hasMore: false,
            isInitialLoading: true,
            isLoadingMore: false,
            initialError: null,
            loadingMoreError: null,
            loadMore: vi.fn(),
            reload: vi.fn()
        });

        renderWithTheme(<PlacePage />);
        expect(screen.getByText(PLACE_PAGE_LOADING_TEXT)).toBeInTheDocument();

        vi.mocked(usePaginatedData).mockReturnValue({
            meta: null,
            items: [],
            hasMore: false,
            isInitialLoading: false,
            isLoadingMore: false,
            initialError: PLACE_PAGE_ERROR_TEXT,
            loadingMoreError: null,
            loadMore: vi.fn(),
            reload: vi.fn()
        });

        renderWithTheme(<PlacePage />);
        expect(screen.getByText(PLACE_PAGE_ERROR_TEXT)).toBeInTheDocument();

        vi.mocked(usePaginatedData).mockReturnValue({
            meta: {
                place_info: {
                    id: 'poznań_główny',
                    display_name: 'Poznań Główny'
                },
                event_list_info: { event_count: 1 }
            },
            items: [createMergedEvent()],
            hasMore: true,
            isInitialLoading: false,
            isLoadingMore: true,
            initialError: null,
            loadingMoreError: null,
            loadMore: vi.fn(),
            reload: vi.fn()
        });

        renderWithTheme(<PlacePage />);
        expect(screen.getByRole('heading', { name: 'Poznań Główny' })).toBeInTheDocument();
        expect(screen.getByText(PLACE_PAGE_EVENT_COUNT_LABEL)).toBeInTheDocument();
        expect(screen.getByText(PLACE_PAGE_INLINE_LOADING_TEXT)).toBeInTheDocument();
        expect(screen.getAllByText('Oznaczenie').length).toBeGreaterThan(0);

        vi.mocked(usePaginatedData).mockReturnValue({
            meta: {
                place_info: {
                    id: 'poznań_główny',
                    display_name: 'Poznań Główny'
                },
                event_list_info: { event_count: 0 }
            },
            items: [],
            hasMore: false,
            isInitialLoading: false,
            isLoadingMore: false,
            initialError: null,
            loadingMoreError: null,
            loadMore: vi.fn(),
            reload: vi.fn()
        });

        renderWithTheme(<PlacePage />);
        expect(screen.getByText(PLACE_PAGE_EMPTY_TEXT)).toBeInTheDocument();
    });
});
