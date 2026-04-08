import { screen } from '@testing-library/react';
import { TOP_NAV_DARK_MODE_LABEL, TOP_NAV_LABEL, TOP_NAV_TABS } from '../TopNav.constants';
import { TopNav } from '../TopNav';
import { renderWithTheme } from '../../../test/renderWithTheme';

describe('TopNav', (): void => {
    it('renders all tabs and highlights types for nested route', (): void => {
        renderWithTheme(<TopNav />, '/loco/abc');

        expect(screen.getByText(TOP_NAV_LABEL)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: TOP_NAV_TABS[0].label })).toHaveStyle({
            fontWeight: '700'
        });
        expect(screen.getByRole('link', { name: TOP_NAV_TABS[1].label })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: TOP_NAV_TABS[2].label })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: TOP_NAV_TABS[3].label })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: TOP_NAV_DARK_MODE_LABEL })).toBeInTheDocument();
    });

    it('renders dark mode toggle', (): void => {
        renderWithTheme(<TopNav />);

        expect(screen.getByRole('button', { name: TOP_NAV_DARK_MODE_LABEL })).toBeInTheDocument();
    });
});
