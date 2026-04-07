import type { ApiEventLoco } from '../../../types/api';
import type { EventPropertyValueRefData } from '../EventPropertyValue';

export const EVENT_ITEM_LOCO_ROUTE_PREFIX = '/loco/';
export const EVENT_ITEM_LOCO_REF_TEXT = 'Zobacz wszystkie wpisy tego pojazdu';

export const getLocoRefData = (loco?: ApiEventLoco): EventPropertyValueRefData | undefined => {
    if (!loco?.loco_ref) {
        return undefined;
    }

    return {
        ref: loco.loco_ref,
        href: `${EVENT_ITEM_LOCO_ROUTE_PREFIX}${loco.id}`,
        refText: EVENT_ITEM_LOCO_REF_TEXT
    };
};
