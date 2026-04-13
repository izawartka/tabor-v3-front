import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TopNavTabList } from '../TopNavTabList';
import { TOP_NAV_LABEL, TOP_NAV_TABS } from '../TopNav.constants';
import { renderWithTheme } from '../../../test/renderWithTheme';

describe('TopNavTabList', (): void => {
    it('renders all tabs and marks nested type routes as active', (): void => {
        renderWithTheme(<TopNavTabList pathname="/loco/abc" />);

        expect(screen.getByText(TOP_NAV_LABEL)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: TOP_NAV_TABS[0].label })).toHaveStyle({
            fontWeight: '700'
        });
        expect(screen.getByRole('link', { name: TOP_NAV_TABS[1].label })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: TOP_NAV_TABS[2].label })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: TOP_NAV_TABS[3].label })).toBeInTheDocument();
    });

    it('calls tab click callback for navigation item click', async (): Promise<void> => {
        const onTabClick = vi.fn();
        const user = userEvent.setup();

        renderWithTheme(<TopNavTabList pathname="/years" onTabClick={onTabClick} />, '/years');

        await user.click(screen.getByRole('link', { name: TOP_NAV_TABS[2].label }));

        expect(onTabClick).toHaveBeenCalledTimes(1);
    });

    it('renders vertical orientation for drawer layout', (): void => {
        renderWithTheme(<TopNavTabList pathname="/years" orientation="vertical" />);

        expect(screen.getByRole('navigation')).toHaveStyle({
            flexDirection: 'column'
        });
    });
});
