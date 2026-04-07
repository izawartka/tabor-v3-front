import { screen } from '@testing-library/react';
import { LoadingState } from '../AsyncState';
import { renderWithTheme } from '../../../test/renderWithTheme';

describe('LoadingState', (): void => {
    it('renders loading text with spinner', (): void => {
        renderWithTheme(<LoadingState text="Ładowanie danych" />);

        expect(screen.getByText('Ładowanie danych')).toBeInTheDocument();
        expect(screen.getByText('Ładowanie danych').previousSibling).toBeInTheDocument();
    });
});
