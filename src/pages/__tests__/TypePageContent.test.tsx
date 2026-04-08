import { screen } from '@testing-library/react';
import {
    TYPE_PAGE_CONTENT_EMPTY_TEXT,
    TYPE_PAGE_CONTENT_ERROR_TEXT,
    TYPE_PAGE_CONTENT_EVENT_COUNT_LABEL,
    TYPE_PAGE_CONTENT_LOADING_TEXT,
    TypePageContent
} from '../TypePageContent';
import { renderWithTheme } from '../../test/renderWithTheme';
import { createEventGroup, createTypeResponse } from '../../test/factories/api';

vi.mock('../../contexts/useRefreshTimestamp', () => ({
    useRefreshTimestamp: vi.fn(() => ({ refreshTimestamp: '1' }))
}));

vi.mock('../../hooks/data/useFetchedData', () => ({
    useFetchedData: vi.fn()
}));

import { useFetchedData } from '../../hooks/data/useFetchedData';

describe('TypePageContent', (): void => {
    it('renders loading, error and content states', (): void => {
        vi.mocked(useFetchedData).mockReturnValue({
            data: null,
            isLoading: true,
            error: null,
            reload: vi.fn()
        });

        renderWithTheme(<TypePageContent typeId="type-1" />);
        expect(screen.getByText(TYPE_PAGE_CONTENT_LOADING_TEXT)).toBeInTheDocument();

        vi.mocked(useFetchedData).mockReturnValue({
            data: null,
            isLoading: false,
            error: TYPE_PAGE_CONTENT_ERROR_TEXT,
            reload: vi.fn()
        });
        renderWithTheme(<TypePageContent typeId="type-1" />);
        expect(screen.getByText(TYPE_PAGE_CONTENT_ERROR_TEXT)).toBeInTheDocument();

        vi.mocked(useFetchedData).mockReturnValue({
            data: createTypeResponse({ event_groups: [] }),
            isLoading: false,
            error: null,
            reload: vi.fn()
        });
        renderWithTheme(<TypePageContent typeId="type-1" />);
        expect(screen.getByText(TYPE_PAGE_CONTENT_EVENT_COUNT_LABEL)).toBeInTheDocument();
        expect(screen.getByText(TYPE_PAGE_CONTENT_EMPTY_TEXT)).toBeInTheDocument();

        vi.mocked(useFetchedData).mockReturnValue({
            data: createTypeResponse({
                event_groups: [createEventGroup({ display_name: 'ET22-003' })]
            }),
            isLoading: false,
            error: null,
            reload: vi.fn()
        });
        renderWithTheme(<TypePageContent typeId="type-1" />);
        expect(screen.getByText('ET22-003')).toBeInTheDocument();
    });
});
