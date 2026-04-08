import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventPropertyLabel } from '../EventPropertyLabel';
import { renderWithTheme } from '../../../test/renderWithTheme';

describe('EventPropertyLabel', (): void => {
    it('renders plain label without children', (): void => {
        renderWithTheme(<EventPropertyLabel text="Kierunek" />);

        expect(screen.getByText('Kierunek')).toBeInTheDocument();
    });

    it('renders plain label and children', (): void => {
        renderWithTheme(
            <EventPropertyLabel text="Kierunek">
                <span>Wartość</span>
            </EventPropertyLabel>
        );

        expect(screen.getByText('Kierunek')).toBeInTheDocument();
        expect(screen.getByText('Wartość')).toBeInTheDocument();
    });

    it('renders tooltip variant', async (): Promise<void> => {
        const user = userEvent.setup();
        vi.spyOn(window, 'matchMedia').mockImplementation(
            () => ({ matches: false }) as MediaQueryList
        );

        renderWithTheme(<EventPropertyLabel text="Kierunek" tooltip="Podpowiedź" />);

        await user.click(screen.getByText('Kierunek'));
        expect(screen.getByRole('tooltip')).toHaveTextContent('Podpowiedź');
    });

    it('renders tooltip content on hover for hover-capable pointers', async (): Promise<void> => {
        const user = userEvent.setup();
        vi.spyOn(window, 'matchMedia').mockImplementation(
            () => ({ matches: true }) as MediaQueryList
        );

        renderWithTheme(<EventPropertyLabel text="Kierunek" tooltip="Podpowiedź" />);

        await user.hover(screen.getByText('Kierunek'));
        expect(screen.getByRole('tooltip')).toHaveTextContent('Podpowiedź');
    });
});
