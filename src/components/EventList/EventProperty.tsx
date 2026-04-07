import type { JSX } from 'react';
import { EventPropertyLabel, type EventPropertyLabelProps } from './EventPropertyLabel';
import { EventPropertyValue, type EventPropertyValueProps } from './EventPropertyValue';
import { isPropertyValueValid } from './utils/isPropertyValueValid';

export interface EventPropertyProps {
    label: EventPropertyLabelProps;
    value: EventPropertyValueProps;
}

export const EventProperty = ({ label, value }: EventPropertyProps): JSX.Element | null => {
    if (!isPropertyValueValid(value.text)) {
        return null;
    }

    return (
        <EventPropertyLabel {...label}>
            <EventPropertyValue {...value} />
        </EventPropertyLabel>
    );
};
