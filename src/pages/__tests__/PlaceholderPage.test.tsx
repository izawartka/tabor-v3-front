import { screen } from '@testing-library/react';
import {
    PLACEHOLDER_EVENT_GROUPS_TEXT,
    PLACEHOLDER_EVENT_LIST_TEXT,
    PlaceholderEventGroupsPage,
    PlaceholderEventListPage
} from '../PlaceholderPage';
import { renderWithTheme } from '../../test/renderWithTheme';

describe('Placeholder pages', (): void => {
    it('renders placeholder texts', (): void => {
        renderWithTheme(<PlaceholderEventGroupsPage />);
        expect(screen.getByText(PLACEHOLDER_EVENT_GROUPS_TEXT)).toBeInTheDocument();

        renderWithTheme(<PlaceholderEventListPage />);
        expect(screen.getByText(PLACEHOLDER_EVENT_LIST_TEXT)).toBeInTheDocument();
    });
});
