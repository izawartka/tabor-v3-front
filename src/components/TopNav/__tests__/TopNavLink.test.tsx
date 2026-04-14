import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TopNavLink } from '../TopNavLink';
import { renderWithTheme } from '../../../test/renderWithTheme';

describe('TopNavLink', (): void => {
    it('renders active link with destination', (): void => {
        renderWithTheme(
            <TopNavLink to="/types" isActive={true}>
                Według typów
            </TopNavLink>
        );

        const link = screen.getByRole('link', { name: 'Według typów' });
        expect(link).toHaveAttribute('href', '/types');
        expect(link).toHaveStyle({ fontWeight: '700' });
    });

    it('renders inactive link style', (): void => {
        renderWithTheme(
            <TopNavLink to="/years" isActive={false}>
                Według dat
            </TopNavLink>
        );

        const link = screen.getByRole('link', { name: 'Według dat' });
        expect(link).toHaveStyle({ fontWeight: '500' });
    });

    it('calls click callback when link is clicked', async (): Promise<void> => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        renderWithTheme(
            <TopNavLink to="/places" isActive={false} onClick={onClick}>
                Według miejsc
            </TopNavLink>
        );

        await user.click(screen.getByRole('link', { name: 'Według miejsc' }));

        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
