import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    SEARCH_CONTAINER_DEFAULT_EMPTY_TEXT,
    SEARCH_CONTAINER_DEFAULT_LOADING_TEXT,
    SearchContainer
} from '../SearchContainer';
import { renderWithTheme } from '../../../test/renderWithTheme';
import { createEventGroup } from '../../../test/factories/api';

describe('SearchContainer', (): void => {
    const baseProps = {
        query: '',
        onQueryChange: vi.fn(),
        placeholder: 'Szukaj',
        isSearchActive: false,
        isSearchLoading: false,
        searchError: null,
        onRetrySearch: vi.fn(),
        searchEventGroups: null,
        getSearchLink: (group: { id: string }): string => `/loco/${group.id}`,
        children: <div>content</div>
    };

    it('renders children when search is inactive', (): void => {
        renderWithTheme(<SearchContainer {...baseProps} />);

        expect(screen.getByText('content')).toBeInTheDocument();
    });

    it('renders loading, error, empty and result states', async (): Promise<void> => {
        const user = userEvent.setup();
        const retry = vi.fn();
        renderWithTheme(
            <SearchContainer
                {...baseProps}
                isSearchActive
                isSearchLoading
                searchLoadingText={SEARCH_CONTAINER_DEFAULT_LOADING_TEXT}
            />
        );

        expect(screen.getByText(SEARCH_CONTAINER_DEFAULT_LOADING_TEXT)).toBeInTheDocument();

        renderWithTheme(
            <>
                <SearchContainer
                    {...baseProps}
                    isSearchActive
                    searchError="Błąd"
                    onRetrySearch={retry}
                />
            </>
        );

        await user.click(screen.getByRole('button', { name: 'Spróbuj ponownie' }));
        expect(retry).toHaveBeenCalled();

        renderWithTheme(<SearchContainer {...baseProps} isSearchActive searchEventGroups={[]} />);
        expect(screen.getByText(SEARCH_CONTAINER_DEFAULT_EMPTY_TEXT)).toBeInTheDocument();

        renderWithTheme(
            <SearchContainer
                {...baseProps}
                isSearchActive
                searchEventGroups={[createEventGroup({ display_name: 'E6ACTadb-043' })]}
            />
        );

        expect(screen.getByText('E6ACTadb-043')).toBeInTheDocument();
    });
});
