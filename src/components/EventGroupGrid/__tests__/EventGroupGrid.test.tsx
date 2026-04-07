import { screen } from '@testing-library/react';
import { EventGroupGrid } from '../EventGroupGrid';
import { renderWithTheme } from '../../../test/renderWithTheme';
import type { ApiEventGroup } from '../../../types/api';

const MOCK_EVENT_GROUPS: ApiEventGroup[] = [
    {
        id: 'dfa75dde',
        display_name: '201Eo-014',
        event_count: 1,
        thumb: '127'
    },
    {
        id: '71efa0bf',
        display_name: 'ET22-015',
        event_count: 2,
        thumb: '202'
    }
];

export const EVENT_GROUP_GRID_LINK_PREFIX = '/loco/';

describe('EventGroupGrid', (): void => {
    it('renders list of cards', (): void => {
        renderWithTheme(
            <EventGroupGrid
                eventGroups={MOCK_EVENT_GROUPS}
                getLink={group => `${EVENT_GROUP_GRID_LINK_PREFIX}${group.id}`}
            />
        );

        expect(screen.getByText(MOCK_EVENT_GROUPS[0].display_name)).toBeInTheDocument();
        expect(screen.getByText(MOCK_EVENT_GROUPS[1].display_name)).toBeInTheDocument();
    });
});
