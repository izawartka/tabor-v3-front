import type { ApiEventTime } from '../../../types/api';
import type { EventPropertyValueRefData } from '../EventPropertyValue';

export const EVENT_ITEM_DATE_ROUTE_PREFIX = '/date/';
export const EVENT_ITEM_TIME_REF_TEXT = 'Zobacz wszystkie wpisy z tą datą';

export const getTimeRefData = (time: ApiEventTime): EventPropertyValueRefData | undefined => {
    if (!time.date_ref) {
        return undefined;
    }

    return {
        ref: time.date_ref,
        href: `${EVENT_ITEM_DATE_ROUTE_PREFIX}${time.date}`,
        refText: EVENT_ITEM_TIME_REF_TEXT
    };
};
