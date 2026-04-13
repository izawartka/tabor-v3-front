import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { MobileTopNavDrawer } from '../MobileTopNavDrawer';
import {
    TOP_NAV_MENU_CLOSE_LABEL,
    TOP_NAV_MENU_OPEN_LABEL,
    TOP_NAV_DRAWER_ARIA_LABEL
} from '../TopNav.constants';
import { renderWithTheme } from '../../../test/renderWithTheme';

vi.mock('../TopNavTabList', () => ({
    TopNavTabList: ({ onTabClick }: { onTabClick?: () => void }): ReactElement => (
        <button onClick={onTabClick}>drawer-tab-mock</button>
    )
}));

vi.mock('../MobileTopNavActions', () => ({
    MobileTopNavActions: (): ReactElement => <div>drawer-actions-mock</div>
}));

describe('MobileTopNavDrawer', (): void => {
    it('opens and closes drawer from trigger button', async (): Promise<void> => {
        const user = userEvent.setup();
        renderWithTheme(<MobileTopNavDrawer pathname="/types" />);

        const trigger = screen.getByRole('button', { name: TOP_NAV_MENU_OPEN_LABEL });
        expect(screen.getByLabelText(TOP_NAV_DRAWER_ARIA_LABEL)).toHaveAttribute(
            'aria-hidden',
            'true'
        );

        await user.click(trigger);

        const closeButtons = screen.getAllByRole('button', { name: TOP_NAV_MENU_CLOSE_LABEL });
        const openedTrigger = closeButtons.find(
            button => button.getAttribute('title') === TOP_NAV_MENU_CLOSE_LABEL
        );

        expect(openedTrigger).toBeInTheDocument();
        expect(screen.getByLabelText(TOP_NAV_DRAWER_ARIA_LABEL)).toHaveAttribute(
            'aria-hidden',
            'false'
        );

        await user.click(openedTrigger as HTMLButtonElement);

        expect(screen.getByRole('button', { name: TOP_NAV_MENU_OPEN_LABEL })).toBeInTheDocument();
        expect(screen.getByLabelText(TOP_NAV_DRAWER_ARIA_LABEL)).toHaveAttribute(
            'aria-hidden',
            'true'
        );
    });

    it('closes drawer when backdrop is clicked', async (): Promise<void> => {
        const user = userEvent.setup();
        renderWithTheme(<MobileTopNavDrawer pathname="/types" />);

        await user.click(screen.getByRole('button', { name: TOP_NAV_MENU_OPEN_LABEL }));

        const backdrop = document.querySelector(
            `button[type="button"][aria-label="${TOP_NAV_MENU_CLOSE_LABEL}"]`
        );
        await user.click(backdrop as HTMLButtonElement);

        expect(screen.getByRole('button', { name: TOP_NAV_MENU_OPEN_LABEL })).toBeInTheDocument();
        expect(screen.getByLabelText(TOP_NAV_DRAWER_ARIA_LABEL)).toHaveAttribute(
            'aria-hidden',
            'true'
        );
    });

    it('closes drawer on Escape key', async (): Promise<void> => {
        const user = userEvent.setup();
        renderWithTheme(<MobileTopNavDrawer pathname="/types" />);

        await user.click(screen.getByRole('button', { name: TOP_NAV_MENU_OPEN_LABEL }));
        fireEvent.keyDown(window, { key: 'Escape' });

        expect(screen.getByRole('button', { name: TOP_NAV_MENU_OPEN_LABEL })).toBeInTheDocument();
        expect(screen.getByLabelText(TOP_NAV_DRAWER_ARIA_LABEL)).toHaveAttribute(
            'aria-hidden',
            'true'
        );
    });

    it('closes drawer after tab click', async (): Promise<void> => {
        const user = userEvent.setup();
        renderWithTheme(<MobileTopNavDrawer pathname="/types" />);

        await user.click(screen.getByRole('button', { name: TOP_NAV_MENU_OPEN_LABEL }));
        await user.click(screen.getByRole('button', { name: 'drawer-tab-mock' }));

        expect(screen.getByRole('button', { name: TOP_NAV_MENU_OPEN_LABEL })).toBeInTheDocument();
        expect(screen.getByLabelText(TOP_NAV_DRAWER_ARIA_LABEL)).toHaveAttribute(
            'aria-hidden',
            'true'
        );
    });
});
