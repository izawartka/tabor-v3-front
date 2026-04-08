import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SchemeToggle } from '../SchemeToggle';
import { renderWithTheme } from '../../../test/renderWithTheme';
import { TOP_NAV_DARK_MODE_LABEL, TOP_NAV_LIGHT_MODE_LABEL } from '../SchemeToggle.constants';

const mockUseColorScheme = vi.hoisted(() => vi.fn());

vi.mock('../../../contexts/useColorScheme', () => ({
    useColorScheme: (): ReturnType<typeof mockUseColorScheme> => mockUseColorScheme()
}));

describe('SchemeToggle', (): void => {
    beforeEach((): void => {
        vi.clearAllMocks();
    });

    it('renders sun icon and dark-mode aria label when scheme is dark', (): void => {
        mockUseColorScheme.mockReturnValue({
            scheme: 'dark',
            toggleScheme: vi.fn()
        });

        const { container } = renderWithTheme(<SchemeToggle />);

        const button = screen.getByRole('button', { name: TOP_NAV_DARK_MODE_LABEL });
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('title', TOP_NAV_DARK_MODE_LABEL);
        expect(container.querySelector('circle')).toBeInTheDocument();
    });

    it('renders moon icon and light-mode aria label when scheme is light', (): void => {
        mockUseColorScheme.mockReturnValue({
            scheme: 'light',
            toggleScheme: vi.fn()
        });

        const { container } = renderWithTheme(<SchemeToggle />);

        const button = screen.getByRole('button', { name: TOP_NAV_LIGHT_MODE_LABEL });
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('title', TOP_NAV_LIGHT_MODE_LABEL);
        expect(container.querySelector('path')).toBeInTheDocument();
    });

    it('calls toggle handler on click', async (): Promise<void> => {
        const toggleScheme = vi.fn();
        const user = userEvent.setup();

        mockUseColorScheme.mockReturnValue({
            scheme: 'dark',
            toggleScheme
        });

        renderWithTheme(<SchemeToggle />);

        await user.click(screen.getByRole('button', { name: TOP_NAV_DARK_MODE_LABEL }));

        expect(toggleScheme).toHaveBeenCalledTimes(1);
    });
});
