import { screen } from '@testing-library/react';
import {
    FAV_PAGE_EMPTY_TEXT,
    FAV_PAGE_ERROR_TEXT,
    FAV_PAGE_EVENT_COUNT_LABEL,
    FAV_PAGE_INLINE_LOADING_TEXT,
    FAV_PAGE_LOADING_TEXT,
    FavPage
} from '../FavPage';
import { renderWithTheme } from '../../test/renderWithTheme';
import { createMergedEvent } from '../../test/factories/api';

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

describe('FavPage', (): void => {
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

        renderWithTheme(<FavPage />);
        expect(screen.getByText(FAV_PAGE_LOADING_TEXT)).toBeInTheDocument();

        vi.mocked(usePaginatedData).mockReturnValue({
            meta: null,
            items: [],
            hasMore: false,
            isInitialLoading: false,
            isLoadingMore: false,
            initialError: FAV_PAGE_ERROR_TEXT,
            loadingMoreError: null,
            loadMore: vi.fn(),
            reload: vi.fn()
        });

        renderWithTheme(<FavPage />);
        expect(screen.getByText(FAV_PAGE_ERROR_TEXT)).toBeInTheDocument();

        vi.mocked(usePaginatedData).mockReturnValue({
            meta: {
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

        renderWithTheme(<FavPage />);
        expect(screen.getByRole('heading', { name: 'Dobre' })).toBeInTheDocument();
        expect(screen.getByText(FAV_PAGE_EVENT_COUNT_LABEL)).toBeInTheDocument();
        expect(screen.getByText(FAV_PAGE_INLINE_LOADING_TEXT)).toBeInTheDocument();
        expect(screen.getAllByText('Oznaczenie').length).toBeGreaterThan(0);

        vi.mocked(usePaginatedData).mockReturnValue({
            meta: {
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

        renderWithTheme(<FavPage />);
        expect(screen.getByText(FAV_PAGE_EMPTY_TEXT)).toBeInTheDocument();
    });
});
