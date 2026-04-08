import { screen } from '@testing-library/react';
import {
    LOCO_PAGE_EMPTY_TEXT,
    LOCO_PAGE_ERROR_TEXT,
    LOCO_PAGE_EVENT_COUNT_LABEL,
    LOCO_PAGE_FACTORY_LABEL,
    LOCO_PAGE_GROUP_LABEL,
    LOCO_PAGE_INLINE_LOADING_TEXT,
    LOCO_PAGE_LOADING_TEXT,
    LocoPage
} from '../LocoPage';
import { renderWithTheme } from '../../test/renderWithTheme';
import { createLocoMeta, createMergedEvent } from '../../test/factories/api';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useParams: vi.fn(() => ({ id: 'loco-1' }))
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

describe('LocoPage', (): void => {
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

        renderWithTheme(<LocoPage />);
        expect(screen.getByText(LOCO_PAGE_LOADING_TEXT)).toBeInTheDocument();

        vi.mocked(usePaginatedData).mockReturnValue({
            meta: null,
            items: [],
            hasMore: false,
            isInitialLoading: false,
            isLoadingMore: false,
            initialError: LOCO_PAGE_ERROR_TEXT,
            loadingMoreError: null,
            loadMore: vi.fn(),
            reload: vi.fn()
        });
        renderWithTheme(<LocoPage />);
        expect(screen.getByText(LOCO_PAGE_ERROR_TEXT)).toBeInTheDocument();

        vi.mocked(usePaginatedData).mockReturnValue({
            meta: createLocoMeta(),
            items: [createMergedEvent()],
            hasMore: true,
            isInitialLoading: false,
            isLoadingMore: true,
            initialError: null,
            loadingMoreError: null,
            loadMore: vi.fn(),
            reload: vi.fn()
        });
        renderWithTheme(<LocoPage />);
        expect(screen.getByText(LOCO_PAGE_GROUP_LABEL)).toBeInTheDocument();
        expect(screen.getAllByText(LOCO_PAGE_FACTORY_LABEL).length).toBeGreaterThan(0);
        expect(screen.getByText(LOCO_PAGE_EVENT_COUNT_LABEL)).toBeInTheDocument();
        expect(screen.getByText(LOCO_PAGE_INLINE_LOADING_TEXT)).toBeInTheDocument();

        vi.mocked(usePaginatedData).mockReturnValue({
            meta: createLocoMeta(),
            items: [],
            hasMore: false,
            isInitialLoading: false,
            isLoadingMore: false,
            initialError: null,
            loadingMoreError: null,
            loadMore: vi.fn(),
            reload: vi.fn()
        });
        renderWithTheme(<LocoPage />);
        expect(screen.getByText(LOCO_PAGE_EMPTY_TEXT)).toBeInTheDocument();
    });
});
