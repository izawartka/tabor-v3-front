import { screen } from '@testing-library/react';
import { PageLayout } from '../PageLayout';
import { PAGE_LAYOUT_FOOTER_TEXT } from '../Footer';
import { renderWithTheme } from '../../../test/renderWithTheme';

describe('PageLayout', (): void => {
    it('renders top navigation, page content and a footer', (): void => {
        renderWithTheme(
            <PageLayout>
                <div>body</div>
            </PageLayout>
        );

        expect(screen.getByRole('navigation', { name: 'Główna nawigacja' })).toBeInTheDocument();
        expect(screen.getByText('body')).toBeInTheDocument();
        expect(screen.getByText(PAGE_LAYOUT_FOOTER_TEXT)).toBeInTheDocument();
    });
});
