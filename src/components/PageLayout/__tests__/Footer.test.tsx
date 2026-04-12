import { screen } from '@testing-library/react';
import { Footer, PAGE_LAYOUT_FOOTER_TEXT } from '../Footer';
import { renderWithTheme } from '../../../test/renderWithTheme';

describe('Footer', (): void => {
    it('renders the footer text', (): void => {
        renderWithTheme(<Footer />);

        expect(screen.getByRole('contentinfo')).toHaveTextContent(PAGE_LAYOUT_FOOTER_TEXT);
    });
});
