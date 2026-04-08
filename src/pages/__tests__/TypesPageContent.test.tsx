import { screen } from '@testing-library/react';
import {
    TYPES_PAGE_CONTENT_EMPTY_TEXT,
    TYPES_PAGE_CONTENT_ERROR_TEXT,
    TYPES_PAGE_CONTENT_LOADING_TEXT,
    TypesPageContent
} from '../TypesPageContent';
import { renderWithTheme } from '../../test/renderWithTheme';
import { createEventGroup, createTypesResponse } from '../../test/factories/api';

vi.mock('../../contexts/useRefreshTimestamp', () => ({
    useRefreshTimestamp: vi.fn(() => ({ refreshTimestamp: '1' }))
}));

vi.mock('../../hooks/data/useFetchedData', () => ({
    useFetchedData: vi.fn()
}));

import { useFetchedData } from '../../hooks/data/useFetchedData';

describe('TypesPageContent', (): void => {
    it('renders loading, error, empty and data states', (): void => {
        vi.mocked(useFetchedData).mockReturnValue({
            data: null,
            isLoading: true,
            error: null,
            reload: vi.fn()
        });

        renderWithTheme(<TypesPageContent />);
        expect(screen.getByText(TYPES_PAGE_CONTENT_LOADING_TEXT)).toBeInTheDocument();

        vi.mocked(useFetchedData).mockReturnValue({
            data: null,
            isLoading: false,
            error: TYPES_PAGE_CONTENT_ERROR_TEXT,
            reload: vi.fn()
        });
        renderWithTheme(<TypesPageContent />);
        expect(screen.getByText(TYPES_PAGE_CONTENT_ERROR_TEXT)).toBeInTheDocument();

        vi.mocked(useFetchedData).mockReturnValue({
            data: createTypesResponse({ event_groups: [] }),
            isLoading: false,
            error: null,
            reload: vi.fn()
        });
        renderWithTheme(<TypesPageContent />);
        expect(screen.getByText(TYPES_PAGE_CONTENT_EMPTY_TEXT)).toBeInTheDocument();

        vi.mocked(useFetchedData).mockReturnValue({
            data: createTypesResponse({
                event_groups: [createEventGroup({ display_name: 'ET22-002' })]
            }),
            isLoading: false,
            error: null,
            reload: vi.fn()
        });
        renderWithTheme(<TypesPageContent />);
        expect(screen.getByText('ET22-002')).toBeInTheDocument();
    });
});
