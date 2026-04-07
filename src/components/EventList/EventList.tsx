import type { JSX } from 'react';
import styled from 'styled-components';
import type { ApiMergedEvent } from '../../types/api';
import { EventView } from './EventView';

const Wrap = styled.section``;

export const EventList = ({ events }: { events: ApiMergedEvent[] }): JSX.Element => (
    <Wrap>
        {events.map(
            (event, index): JSX.Element => (
                <EventView key={index} event={event} />
            )
        )}
    </Wrap>
);
