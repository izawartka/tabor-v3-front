import { screen } from '@testing-library/react';
import { NOT_FOUND_PAGE_TEXT, NotFoundPage } from '../NotFoundPage';
import { renderWithTheme } from '../../test/renderWithTheme';

describe('NotFoundPage', (): void => {
    it('renders not-found message', (): void => {
        renderWithTheme(<NotFoundPage />);

        expect(screen.getByText(NOT_FOUND_PAGE_TEXT)).toBeInTheDocument();
    });
});
