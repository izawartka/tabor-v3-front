import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PrivateModeToggle } from '../PrivateModeToggle';
import { renderWithTheme } from '../../../test/renderWithTheme';
import {
    TOP_NAV_PRIVATE_MODE_OFF_LABEL,
    TOP_NAV_PRIVATE_MODE_ON_LABEL
} from '../PrivateModeToggle.constants';

const mockUsePrivateMode = vi.hoisted(() => vi.fn());

vi.mock('../../../contexts/usePrivateMode', () => ({
    usePrivateMode: (): ReturnType<typeof mockUsePrivateMode> => mockUsePrivateMode()
}));

describe('PrivateModeToggle', (): void => {
    beforeEach((): void => {
        vi.clearAllMocks();
    });

    it('renders off-state label when private mode is disabled', (): void => {
        mockUsePrivateMode.mockReturnValue({
            privateMode: false,
            togglePrivateMode: vi.fn()
        });

        renderWithTheme(<PrivateModeToggle />);

        const button = screen.getByRole('button', { name: TOP_NAV_PRIVATE_MODE_OFF_LABEL });
        expect(button).toHaveAttribute('title', TOP_NAV_PRIVATE_MODE_OFF_LABEL);
        expect(button.querySelector('svg')).toBeInTheDocument();
    });

    it('renders on-state label when private mode is enabled', (): void => {
        mockUsePrivateMode.mockReturnValue({
            privateMode: true,
            togglePrivateMode: vi.fn()
        });

        renderWithTheme(<PrivateModeToggle />);

        const button = screen.getByRole('button', { name: TOP_NAV_PRIVATE_MODE_ON_LABEL });
        expect(button).toHaveAttribute('title', TOP_NAV_PRIVATE_MODE_ON_LABEL);
    });

    it('calls toggle handler on click', async (): Promise<void> => {
        const togglePrivateMode = vi.fn();
        const user = userEvent.setup();

        mockUsePrivateMode.mockReturnValue({
            privateMode: false,
            togglePrivateMode
        });

        renderWithTheme(<PrivateModeToggle />);

        await user.click(screen.getByRole('button', { name: TOP_NAV_PRIVATE_MODE_OFF_LABEL }));

        expect(togglePrivateMode).toHaveBeenCalledTimes(1);
    });
});
