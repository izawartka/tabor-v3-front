import type { JSX } from 'react';
import { EventPropertyLabel, type EventPropertyLabelProps } from './EventPropertyLabel';
import { EventPropertyValue, type EventPropertyValueProps } from './EventPropertyValue';
import { isPropertyValueValid } from './utils/isPropertyValueValid';

export interface EventMultiValuePropertyProps {
    label: EventPropertyLabelProps;
    values: EventPropertyValueProps[];
    separator: string;
}

export const EventMultiValueProperty = ({
    label,
    values,
    separator
}: EventMultiValuePropertyProps): JSX.Element | null => {
    const filteredValues = values.filter(value => isPropertyValueValid(value.text));

    if (filteredValues.length === 0) {
        return null;
    }

    const valueItems = filteredValues.map((value, index) => (
        <EventPropertyValue key={index} {...value} />
    ));

    const separatedValues = valueItems.reduce((acc: JSX.Element[], value, index) => {
        acc.push(value);
        if (index < valueItems.length - 1) {
            acc.push(<span key={`sep-${index}`}>{separator}</span>);
        }
        return acc;
    }, []);

    return <EventPropertyLabel {...label}>{separatedValues}</EventPropertyLabel>;
};
