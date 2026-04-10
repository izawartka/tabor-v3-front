import { screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { TOP_NAV_LABEL, TOP_NAV_TABS } from '../TopNav.constants';
import { TopNav } from '../TopNav';
import { renderWithTheme } from '../../../test/renderWithTheme';

vi.mock('../SchemeToggle', () => ({
    SchemeToggle: (): ReactElement => <button aria-label="scheme-toggle-mock">toggle</button>
}));

vi.mock('../PrivateModeToggle', () => ({
    PrivateModeToggle: (): ReactElement => (
        <button aria-label="private-mode-toggle-mock">private-mode</button>
    )
}));

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
        expect(
            screen.getByRole('button', { name: 'private-mode-toggle-mock' })
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'scheme-toggle-mock' })).toBeInTheDocument();
    });

    it('renders scheme toggle component', (): void => {
        renderWithTheme(<TopNav />);

        expect(
            screen.getByRole('button', { name: 'private-mode-toggle-mock' })
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'scheme-toggle-mock' })).toBeInTheDocument();
    });
});
