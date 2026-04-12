import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RefreshTimestampContext } from '../../../contexts/refreshTimestampStore';
import { PrefetchedLink } from '../PrefetchedLink';
import { prefetchRouteData } from '../../../services/prefetchService';

vi.mock('../../../services/prefetchService', async importOriginal => {
    const actual = await importOriginal<typeof import('../../../services/prefetchService')>();

    return {
        ...actual,
        prefetchRouteData: vi.fn()
    };
});

const renderWithRefreshTimestamp = (ui: ReactElement): void => {
    render(
        <RefreshTimestampContext.Provider
            value={{
                refreshTimestamp: '123',
                isLoading: false,
                error: null,
                retry: vi.fn()
            }}
        >
            <MemoryRouter>{ui}</MemoryRouter>
        </RefreshTimestampContext.Provider>
    );
};

describe('PrefetchedLink', (): void => {
    beforeEach((): void => {
        vi.clearAllMocks();
        vi.useRealTimers();
    });

    it('prefetches route once on user intent events', (): void => {
        vi.useFakeTimers();

        renderWithRefreshTimestamp(<PrefetchedLink to="/loco/abc">Open</PrefetchedLink>);

        const link = screen.getByRole('link', { name: 'Open' });
        fireEvent.mouseEnter(link);
        fireEvent.focus(link);
        fireEvent.pointerDown(link);

        vi.runAllTimers();

        expect(prefetchRouteData).toHaveBeenCalledTimes(1);
        expect(prefetchRouteData).toHaveBeenCalledWith('/loco/abc', '123');
    });

    it('does not prefetch when prefetchMode is none', (): void => {
        renderWithRefreshTimestamp(
            <PrefetchedLink to="/loco/abc" prefetchMode="none">
                Open
            </PrefetchedLink>
        );

        fireEvent.mouseEnter(screen.getByRole('link', { name: 'Open' }));
        fireEvent.focus(screen.getByRole('link', { name: 'Open' }));
        fireEvent.pointerDown(screen.getByRole('link', { name: 'Open' }));

        expect(prefetchRouteData).not.toHaveBeenCalled();
    });

    it('does not prefetch without user intent event', (): void => {
        renderWithRefreshTimestamp(<PrefetchedLink to="/loco/abc">Open</PrefetchedLink>);

        expect(prefetchRouteData).not.toHaveBeenCalled();
    });

    it('does not prefetch without refresh timestamp', (): void => {
        render(
            <MemoryRouter>
                <PrefetchedLink to="/loco/abc">Open</PrefetchedLink>
            </MemoryRouter>
        );

        fireEvent.mouseEnter(screen.getByRole('link', { name: 'Open' }));

        expect(prefetchRouteData).not.toHaveBeenCalled();
    });
});
