import { screen } from '@testing-library/react';
import {
    DATE_PAGE_EMPTY_TEXT,
    DATE_PAGE_ERROR_TEXT,
    DATE_PAGE_EVENT_COUNT_LABEL,
    DATE_PAGE_GROUP_LABEL,
    DATE_PAGE_INLINE_LOADING_TEXT,
    DATE_PAGE_LOADING_TEXT,
    DatePage
} from '../DatePage';
import { renderWithTheme } from '../../test/renderWithTheme';
import { createMergedEvent, createReference } from '../../test/factories/api';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useParams: vi.fn(() => ({ date: '2025.01.02' }))
    };
});

vi.mock('../../contexts/useRefreshTimestamp', () => ({
    useRefreshTimestamp: vi.fn(() => ({ refreshTimestamp: '1' }))
}));

vi.mock('../../contexts/usePrivateMode', () => ({
    usePrivateMode: vi.fn(() => ({ privateMode: false, togglePrivateMode: vi.fn() }))
}));

vi.mock('../../hooks/data/usePaginatedData', () => ({
    usePaginatedData: vi.fn()
}));

vi.mock('../../hooks/scroll/useInfiniteScroll', () => ({
    useInfiniteScroll: vi.fn(() => ({ current: null }))
}));

import { usePaginatedData } from '../../hooks/data/usePaginatedData';
import { usePrivateMode } from '../../contexts/usePrivateMode';

describe('DatePage', (): void => {
    it('renders loading, error and content states', (): void => {
        vi.mocked(usePrivateMode).mockReturnValue({
            privateMode: false,
            togglePrivateMode: vi.fn()
        });

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

        renderWithTheme(<DatePage />);
        expect(screen.getByText(DATE_PAGE_LOADING_TEXT)).toBeInTheDocument();

        vi.mocked(usePaginatedData).mockReturnValue({
            meta: null,
            items: [],
            hasMore: false,
            isInitialLoading: false,
            isLoadingMore: false,
            initialError: DATE_PAGE_ERROR_TEXT,
            loadingMoreError: null,
            loadMore: vi.fn(),
            reload: vi.fn()
        });

        renderWithTheme(<DatePage />);
        expect(screen.getByText(DATE_PAGE_ERROR_TEXT)).toBeInTheDocument();

        vi.mocked(usePaginatedData).mockReturnValue({
            meta: {
                date_info: {
                    date: '2025.01.02',
                    year: '2025',
                    year_ref: createReference({ event_count: 10 }),
                    common_private_info: 'prywatna notatka'
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

        renderWithTheme(<DatePage />);
        expect(screen.getByText(DATE_PAGE_GROUP_LABEL)).toBeInTheDocument();
        expect(screen.getByText(DATE_PAGE_EVENT_COUNT_LABEL)).toBeInTheDocument();
        expect(screen.getByText(DATE_PAGE_INLINE_LOADING_TEXT)).toBeInTheDocument();
        expect(screen.queryByText('prywatna notatka')).not.toBeInTheDocument();
        expect(screen.getAllByText('Oznaczenie').length).toBeGreaterThan(0);

        vi.mocked(usePrivateMode).mockReturnValue({
            privateMode: true,
            togglePrivateMode: vi.fn()
        });

        vi.mocked(usePaginatedData).mockReturnValue({
            meta: {
                date_info: {
                    date: '2025.01.02',
                    year: '2025',
                    year_ref: createReference({ event_count: 10 }),
                    common_private_info: 'prywatna notatka'
                },
                event_list_info: { event_count: 1 }
            },
            items: [createMergedEvent()],
            hasMore: true,
            isInitialLoading: false,
            isLoadingMore: false,
            initialError: null,
            loadingMoreError: null,
            loadMore: vi.fn(),
            reload: vi.fn()
        });

        renderWithTheme(<DatePage />);
        expect(screen.getByText('prywatna notatka')).toBeInTheDocument();

        vi.mocked(usePrivateMode).mockReturnValue({
            privateMode: false,
            togglePrivateMode: vi.fn()
        });

        vi.mocked(usePaginatedData).mockReturnValue({
            meta: {
                date_info: {
                    date: '2025.01.02',
                    year: '2025',
                    year_ref: createReference({ event_count: 10 }),
                    common_private_info: null
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

        renderWithTheme(<DatePage />);
        expect(screen.getByText(DATE_PAGE_EMPTY_TEXT)).toBeInTheDocument();
    });
});
