import { screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { TopNav } from '../TopNav';
import { renderWithTheme } from '../../../test/renderWithTheme';

const mockUseMediaQuery = vi.hoisted(() => vi.fn());

vi.mock('../../../hooks/media/useMediaQuery', () => ({
    useMediaQuery: (query: string): ReturnType<typeof mockUseMediaQuery> => mockUseMediaQuery(query)
}));

vi.mock('../TopNavTabList', () => ({
    TopNavTabList: (): ReactElement => <nav aria-label="desktop-navigation-mock">tabs</nav>
}));

vi.mock('../TopNavActions', () => ({
    TopNavActions: (): ReactElement => <div aria-label="top-nav-actions-mock">actions</div>
}));

vi.mock('../MobileTopNavDrawer', () => ({
    MobileTopNavDrawer: (): ReactElement => <button aria-label="mobile-drawer-mock">drawer</button>
}));

describe('TopNav', (): void => {
    beforeEach((): void => {
        vi.clearAllMocks();
    });

    it('renders desktop navigation when viewport is not mobile', (): void => {
        mockUseMediaQuery.mockReturnValue(false);

        renderWithTheme(<TopNav />, '/loco/abc');

        expect(
            screen.getByRole('navigation', { name: 'desktop-navigation-mock' })
        ).toBeInTheDocument();
        expect(screen.getByLabelText('top-nav-actions-mock')).toBeInTheDocument();
        expect(
            screen.queryByRole('button', { name: 'mobile-drawer-mock' })
        ).not.toBeInTheDocument();
    });

    it('renders mobile drawer when viewport is mobile', (): void => {
        mockUseMediaQuery.mockReturnValue(true);

        renderWithTheme(<TopNav />);

        expect(screen.getByRole('button', { name: 'mobile-drawer-mock' })).toBeInTheDocument();
        expect(
            screen.queryByRole('navigation', { name: 'desktop-navigation-mock' })
        ).not.toBeInTheDocument();
        expect(screen.queryByLabelText('top-nav-actions-mock')).not.toBeInTheDocument();
    });
});
