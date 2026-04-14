import type { JSX } from 'react';
import styled from 'styled-components';
import type { ApiEventGroup } from '../../types/api';
import { ProgressivePhoto } from '../common/ProgressivePhoto';
import { PrefetchedLink } from '../common/PrefetchedLink';

export const EVENT_GROUP_CARD_EVENT_COUNT_PREFIX = 'Liczba wpisów: ';

const StyledCard = styled(PrefetchedLink)`
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: ${({ theme }): string => theme.colors.surface};
    border: 1px solid ${({ theme }): string => theme.colors.border};
    border-radius: ${({ theme }): string => theme.radii.lg};
    padding: 10px;
    box-shadow: ${({ theme }): string => theme.shadow};
    transition: transform 0.15s ease;

    &:hover {
        transform: translateY(-2px);
    }
`;

const StyledDetails = styled.div`
    padding: 0 2px;
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const StyledTitle = styled.h3`
    font-size: 1rem;
    margin: 0;
    color: ${({ theme }): string => theme.colors.text};
`;

const StyledEventCount = styled.p`
    margin: 0;
    color: ${({ theme }): string => theme.colors.secondaryText};
    font-size: 0.9rem;
`;

interface EventGroupCardProps {
    eventGroup: ApiEventGroup;
    to: string;
}

export const EventGroupCard = ({ eventGroup, to }: EventGroupCardProps): JSX.Element => (
    <StyledCard to={to} aria-label={`Przejdź do ${eventGroup.display_name}`}>
        <ProgressivePhoto photoId={eventGroup.thumb} alt={eventGroup.display_name} />
        <StyledDetails>
            <StyledTitle>{eventGroup.display_name}</StyledTitle>
            <StyledEventCount>
                {EVENT_GROUP_CARD_EVENT_COUNT_PREFIX}
                {eventGroup.event_count}
            </StyledEventCount>
        </StyledDetails>
    </StyledCard>
);
