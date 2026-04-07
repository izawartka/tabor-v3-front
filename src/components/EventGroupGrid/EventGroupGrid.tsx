import type { JSX } from 'react';
import styled from 'styled-components';
import type { ApiEventGroup } from '../../types/api';
import { EventGroupCard } from './EventGroupCard';

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;

    @media (max-width: ${({ theme }): number => theme.breakpoints.tablet}px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (max-width: ${({ theme }): number => theme.breakpoints.mobile}px) {
        grid-template-columns: 1fr;
    }
`;

export const EventGroupGrid = ({
    eventGroups,
    getLink
}: {
    eventGroups: ApiEventGroup[];
    getLink: (eventGroup: ApiEventGroup) => string;
}): JSX.Element => (
    <Grid>
        {eventGroups.map(eventGroup => (
            <EventGroupCard key={eventGroup.id} eventGroup={eventGroup} to={getLink(eventGroup)} />
        ))}
    </Grid>
);
