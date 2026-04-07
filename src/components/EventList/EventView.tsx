import type { JSX } from 'react';
import styled from 'styled-components';
import type { ApiMergedEvent } from '../../types/api';
import { EventMediaView } from './EventMediaView';
import { EventProperty } from './EventProperty';
import { SubEventView } from './SubEventView';
import { getTimeRefData } from './utils/getTimeRefData';

export const EVENT_ITEM_TIME_LABEL = 'Czas';

const Card = styled.article`
    background: ${({ theme }): string => theme.colors.surface};
    border: 1px solid ${({ theme }): string => theme.colors.border};
    border-radius: ${({ theme }): string => theme.radii.lg};
    overflow: hidden;
    margin-bottom: 16px;
`;

const Body = styled.div`
    padding: 14px;
`;

const Properties = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const EventView = ({ event }: { event: ApiMergedEvent }): JSX.Element => {
    return (
        <Card>
            <EventMediaView media={event.common.media} />
            <Body>
                <Properties>
                    <EventProperty
                        label={{ text: EVENT_ITEM_TIME_LABEL }}
                        value={{
                            text: event.common.time.text,
                            refData: getTimeRefData(event.common.time)
                        }}
                    />
                </Properties>
                {event.subevents?.map(
                    (subEvent, idx): JSX.Element => (
                        <SubEventView key={idx} subEvent={subEvent} />
                    )
                )}
            </Body>
        </Card>
    );
};
