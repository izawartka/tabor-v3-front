import { screen } from '@testing-library/react';
import { FAVORITE_BADGE_TEXT, FavoriteBadge } from '../FavoriteBadge';
import { renderWithTheme } from '../../../test/renderWithTheme';

describe('FavoriteBadge', (): void => {
    it('renders badge label', (): void => {
        renderWithTheme(<FavoriteBadge />);

        expect(screen.getByText(FAVORITE_BADGE_TEXT)).toBeInTheDocument();
    });
});
