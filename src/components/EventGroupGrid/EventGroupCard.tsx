import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import type { ApiEventGroup } from '../../types/api';
import { ProgressivePhoto } from '../common/ProgressivePhoto';

export const EVENT_GROUP_CARD_EVENT_COUNT_PREFIX = 'Liczba wpisów: ';

const Card = styled(Link)`
    display: flex;
    flex-direction: column;
    gap: 10px;
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

const Title = styled.h3`
    font-size: 1rem;
    margin: 0;
    color: ${({ theme }): string => theme.colors.text};
`;

const Count = styled.p`
    margin: 0;
    color: ${({ theme }): string => theme.colors.secondaryText};
    font-size: 0.9rem;
`;

interface EventGroupCardProps {
    eventGroup: ApiEventGroup;
    to: string;
}

export const EventGroupCard = ({ eventGroup, to }: EventGroupCardProps): JSX.Element => (
    <Card to={to} aria-label={`Przejdź do ${eventGroup.display_name}`}>
        <ProgressivePhoto photoId={eventGroup.thumb} alt={eventGroup.display_name} />
        <Title>{eventGroup.display_name}</Title>
        <Count>
            {EVENT_GROUP_CARD_EVENT_COUNT_PREFIX}
            {eventGroup.event_count}
        </Count>
    </Card>
);
