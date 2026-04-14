import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TopNavToggle } from '../TopNavToggle';
import { renderWithTheme } from '../../../test/renderWithTheme';

describe('TopNavToggle', (): void => {
    it('renders icon-only variant by default', (): void => {
        renderWithTheme(
            <TopNavToggle
                icon={<svg aria-hidden="true" data-testid="toggle-icon" />}
                onClick={vi.fn()}
                isOn={false}
                ariaLabel="Przełącz"
                label="Przełącz tryb"
            />
        );

        const button = screen.getByRole('button', { name: 'Przełącz' });
        expect(button).toHaveAttribute('title', 'Przełącz tryb');
        expect(screen.getByTestId('toggle-icon')).toBeInTheDocument();
        expect(screen.queryByText('Przełącz tryb')).not.toBeInTheDocument();
    });

    it('renders text label when showLabel is enabled', (): void => {
        renderWithTheme(
            <TopNavToggle
                icon={<svg aria-hidden="true" data-testid="toggle-icon" />}
                onClick={vi.fn()}
                isOn={true}
                ariaLabel="Przełącz"
                label="Przełącz tryb"
                showLabel={true}
            />
        );

        expect(screen.getByRole('button', { name: 'Przełącz' })).toBeInTheDocument();
        expect(screen.getByText('Przełącz tryb')).toBeInTheDocument();
    });

    it('calls click handler when activated', async (): Promise<void> => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        renderWithTheme(
            <TopNavToggle
                icon={<svg aria-hidden="true" />}
                onClick={onClick}
                isOn={true}
                ariaLabel="Przełącz"
                label="Przełącz tryb"
            />
        );

        await user.click(screen.getByRole('button', { name: 'Przełącz' }));

        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
