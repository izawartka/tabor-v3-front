import { screen } from '@testing-library/react';
import { PageLayout } from '../PageLayout';
import { renderWithTheme } from '../../../test/renderWithTheme';

describe('PageLayout', (): void => {
    it('renders top navigation and page content', (): void => {
        renderWithTheme(
            <PageLayout>
                <div>body</div>
            </PageLayout>
        );

        expect(screen.getByRole('navigation', { name: 'Główna nawigacja' })).toBeInTheDocument();
        expect(screen.getByText('body')).toBeInTheDocument();
    });
});
