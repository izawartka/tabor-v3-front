import type { ApiEventPlace } from '../../../types/api';
import type { EventPropertyValueRefData } from '../EventPropertyValue';

export const EVENT_ITEM_PLACE_ROUTE_PREFIX = '/place/';
export const EVENT_ITEM_PLACE_REF_TEXT = 'Zobacz wszystkie wpisy z tego miejsca';

export const getPlaceRefData = (place: ApiEventPlace): EventPropertyValueRefData | undefined => {
    if (!place.place_ref) {
        return undefined;
    }

    return {
        ref: place.place_ref,
        href: `${EVENT_ITEM_PLACE_ROUTE_PREFIX}${place.id}`,
        refText: EVENT_ITEM_PLACE_REF_TEXT
    };
};
