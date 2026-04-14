import { screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MobileTopNavActions } from '../MobileTopNavActions';
import { TOP_NAV_SETTINGS_LABEL } from '../TopNav.constants';
import { renderWithTheme } from '../../../test/renderWithTheme';

const mockPrivateModeToggle = vi.hoisted(() => vi.fn());
const mockSchemeToggle = vi.hoisted(() => vi.fn());

vi.mock('../PrivateModeToggle', () => ({
    PrivateModeToggle: ({ showLabel }: { showLabel?: boolean }): ReactElement => {
        mockPrivateModeToggle(showLabel);
        return <button>private-mode-mobile-toggle</button>;
    }
}));

vi.mock('../SchemeToggle', () => ({
    SchemeToggle: ({ showLabel }: { showLabel?: boolean }): ReactElement => {
        mockSchemeToggle(showLabel);
        return <button>scheme-mobile-toggle</button>;
    }
}));

describe('MobileTopNavActions', (): void => {
    beforeEach((): void => {
        vi.clearAllMocks();
    });

    it('renders settings label and passes showLabel to child toggles', (): void => {
        renderWithTheme(<MobileTopNavActions />);

        expect(screen.getByText(TOP_NAV_SETTINGS_LABEL)).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'private-mode-mobile-toggle' })
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'scheme-mobile-toggle' })).toBeInTheDocument();
        expect(mockPrivateModeToggle).toHaveBeenCalledWith(true);
        expect(mockSchemeToggle).toHaveBeenCalledWith(true);
    });
});
