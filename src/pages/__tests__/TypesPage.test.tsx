import { screen } from '@testing-library/react';
import {
    TYPES_PAGE_EMPTY_TEXT,
    TYPES_PAGE_LOADING_TEXT,
    TYPES_PAGE_PLACEHOLDER,
    TypesPage
} from '../TypesPage';
import { renderWithTheme } from '../../test/renderWithTheme';
import { createEventGroupListResponse } from '../../test/factories/api';

vi.mock('../../hooks/query/useSearchQuery', () => ({
    useSearchQuery: vi.fn()
}));

vi.mock('../../hooks/query/useEventGroupSearch', () => ({
    useEventGroupSearch: vi.fn()
}));

import { useSearchQuery } from '../../hooks/query/useSearchQuery';
import { useEventGroupSearch } from '../../hooks/query/useEventGroupSearch';

describe('TypesPage', (): void => {
    it('passes mapped props to search container and renders search results', (): void => {
        const searchData = createEventGroupListResponse();

        vi.mocked(useSearchQuery).mockReturnValue({ query: 'et2', setQuery: vi.fn() });
        vi.mocked(useEventGroupSearch).mockReturnValue({
            normalizedQuery: 'et2',
            isActive: true,
            data: searchData,
            isLoading: false,
            error: null,
            reload: vi.fn()
        });

        renderWithTheme(<TypesPage />);

        expect(screen.getByRole('searchbox')).toHaveAttribute(
            'placeholder',
            TYPES_PAGE_PLACEHOLDER
        );
        expect(screen.queryByText(TYPES_PAGE_LOADING_TEXT)).not.toBeInTheDocument();
        expect(screen.queryByText(TYPES_PAGE_EMPTY_TEXT)).not.toBeInTheDocument();
        expect(screen.getByText(searchData.event_groups[0].display_name)).toBeInTheDocument();
    });
});
