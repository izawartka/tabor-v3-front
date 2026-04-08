import { screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { TYPE_PAGE_PLACEHOLDER, TypePage } from '../TypePage';
import { renderWithTheme } from '../../test/renderWithTheme';
import { createEventGroupListResponse } from '../../test/factories/api';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useParams: vi.fn(() => ({ id: 'type-1' }))
    };
});

vi.mock('../../hooks/query/useSearchQuery', () => ({
    useSearchQuery: vi.fn()
}));

vi.mock('../../hooks/query/useEventGroupSearch', () => ({
    useEventGroupSearch: vi.fn()
}));

vi.mock('../TypePageContent', () => ({
    TypePageContent: ({ typeId }: { typeId: string }): ReactElement => (
        <div>type-content-{typeId}</div>
    )
}));

import { useSearchQuery } from '../../hooks/query/useSearchQuery';
import { useEventGroupSearch } from '../../hooks/query/useEventGroupSearch';

describe('TypePage', (): void => {
    it('renders search section and nested type content', (): void => {
        vi.mocked(useSearchQuery).mockReturnValue({ query: '', setQuery: vi.fn() });
        vi.mocked(useEventGroupSearch).mockReturnValue({
            normalizedQuery: '',
            isActive: false,
            data: createEventGroupListResponse(),
            isLoading: false,
            error: null,
            reload: vi.fn()
        });

        renderWithTheme(<TypePage />);

        expect(screen.getByRole('searchbox')).toHaveAttribute('placeholder', TYPE_PAGE_PLACEHOLDER);
        expect(screen.getByText('type-content-type-1')).toBeInTheDocument();
    });
});
