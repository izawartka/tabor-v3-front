import { screen } from '@testing-library/react';
import { EVENT_GROUP_CARD_EVENT_COUNT_PREFIX, EventGroupCard } from '../EventGroupCard';
import { renderWithTheme } from '../../../test/renderWithTheme';
import type { ApiEventGroup } from '../../../types/api';

const MOCK_EVENT_GROUP: ApiEventGroup = {
    id: 'dfa75dde',
    display_name: '201Eo-014',
    event_count: 1,
    thumb: '127'
};

describe('EventGroupCard', (): void => {
    it('shows group data', (): void => {
        renderWithTheme(
            <EventGroupCard eventGroup={MOCK_EVENT_GROUP} to={`/loco/${MOCK_EVENT_GROUP.id}`} />
        );

        expect(screen.getByText(MOCK_EVENT_GROUP.display_name)).toBeInTheDocument();
        expect(
            screen.getByText(
                `${EVENT_GROUP_CARD_EVENT_COUNT_PREFIX}${MOCK_EVENT_GROUP.event_count}`
            )
        ).toBeInTheDocument();
    });
});
