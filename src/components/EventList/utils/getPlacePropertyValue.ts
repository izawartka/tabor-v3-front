import type { ApiEventPlace } from '../../../types/api';
import type { EventPropertyValueProps } from '../EventPropertyValue';
import { getPlaceRefData } from './getPlaceRefData';

export const EVENT_ITEM_PLACE_SEPARATOR = ' - ';

export const getPlacePropertyValue = (place: ApiEventPlace): EventPropertyValueProps => {
    return {
        text: place.text,
        refData: getPlaceRefData(place)
    };
};
