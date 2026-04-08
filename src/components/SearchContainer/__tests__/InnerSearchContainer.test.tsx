import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    DEFAULT_EMPTY_TEXT,
    DEFAULT_LOADING_TEXT,
    InnerSearchContainer
} from '../InnerSearchContainer';
import { renderWithTheme } from '../../../test/renderWithTheme';
import { createEventGroup } from '../../../test/factories/api';

describe('InnerSearchContainer', (): void => {
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
        renderWithTheme(<InnerSearchContainer {...baseProps} />);

        expect(screen.getByText('content')).toBeInTheDocument();
    });

    it('renders loading, error, empty and result states', async (): Promise<void> => {
        const user = userEvent.setup();
        const retry = vi.fn();
        renderWithTheme(
            <InnerSearchContainer
                {...baseProps}
                isSearchActive
                isSearchLoading
                searchLoadingText={DEFAULT_LOADING_TEXT}
            />
        );

        expect(screen.getByText(DEFAULT_LOADING_TEXT)).toBeInTheDocument();

        renderWithTheme(
            <>
                <InnerSearchContainer
                    {...baseProps}
                    isSearchActive
                    searchError="Błąd"
                    onRetrySearch={retry}
                />
            </>
        );

        await user.click(screen.getByRole('button', { name: 'Spróbuj ponownie' }));
        expect(retry).toHaveBeenCalled();

        renderWithTheme(
            <InnerSearchContainer {...baseProps} isSearchActive searchEventGroups={[]} />
        );
        expect(screen.getByText(DEFAULT_EMPTY_TEXT)).toBeInTheDocument();

        renderWithTheme(
            <InnerSearchContainer
                {...baseProps}
                isSearchActive
                searchEventGroups={[createEventGroup({ display_name: 'E6ACTadb-043' })]}
            />
        );

        expect(screen.getByText('E6ACTadb-043')).toBeInTheDocument();
    });
});
