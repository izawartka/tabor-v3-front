import type { JSX } from 'react';
import styled from 'styled-components';
import type { ApiSubevent } from '../../types/api';
import { EventMultiValueProperty } from './EventMultiValueProperty';
import { EventProperty } from './EventProperty';
import { getLocoRefData } from './utils/getLocoRefData';
import { EVENT_ITEM_PLACE_SEPARATOR, getPlacePropertyValue } from './utils/getPlacePropertyValue';

export const EVENT_ITEM_LABEL = 'Oznaczenie';
export const EVENT_ITEM_FACTORY_LABEL = 'Oznaczenie fabryczne';
export const EVENT_ITEM_PLACE_LABEL = 'Miejsce';
export const EVENT_ITEM_DIRECTION_LABEL = 'Kierunek';
export const EVENT_ITEM_DIRECTION_TOOLTIP = 'Orientacyjnie; nie określa stacji docelowej pociągu';
export const EVENT_ITEM_TRAIN_LABEL = 'Pociąg';
export const EVENT_ITEM_COMPOSITION_LABEL = 'Skład';
export const EVENT_ITEM_EMPTY_COMPOSITION_TEXT = 'luzem / n.d.';
export const EVENT_ITEM_INFO_LABEL = 'Info';
export const EVENT_ITEM_PRIVATE_NOTE_LABEL = 'Notatka osobista';

const Properties = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const SubEventBox = styled.div`
    border-top: 1px solid ${({ theme }): string => theme.colors.border};
    padding-top: 10px;
    margin-top: 10px;
`;

export const SubEventView = ({ subEvent }: { subEvent: ApiSubevent }): JSX.Element => {
    const placeValues =
        subEvent.places && subEvent.places.length > 0
            ? subEvent.places.map(place => getPlacePropertyValue(place))
            : undefined;

    return (
        <SubEventBox>
            <Properties>
                <EventProperty
                    label={{ text: EVENT_ITEM_LABEL }}
                    value={{
                        text: subEvent.loco?.class_no,
                        refData: getLocoRefData(subEvent.loco)
                    }}
                />
                <EventProperty
                    label={{ text: EVENT_ITEM_FACTORY_LABEL }}
                    value={{ text: subEvent.loco?.series_no }}
                />
                <EventMultiValueProperty
                    label={{ text: EVENT_ITEM_PLACE_LABEL }}
                    values={placeValues ?? []}
                    separator={EVENT_ITEM_PLACE_SEPARATOR}
                />
                <EventProperty
                    label={{
                        text: EVENT_ITEM_DIRECTION_LABEL,
                        tooltip: EVENT_ITEM_DIRECTION_TOOLTIP
                    }}
                    value={{ text: subEvent.direction }}
                />
                <EventProperty
                    label={{ text: EVENT_ITEM_TRAIN_LABEL }}
                    value={{ text: subEvent.train }}
                />
                <EventProperty
                    label={{ text: EVENT_ITEM_COMPOSITION_LABEL }}
                    value={{ text: subEvent.composition || EVENT_ITEM_EMPTY_COMPOSITION_TEXT }}
                />
                <EventProperty
                    label={{ text: EVENT_ITEM_INFO_LABEL }}
                    value={{ text: subEvent.info }}
                />
                <EventProperty
                    label={{ text: EVENT_ITEM_PRIVATE_NOTE_LABEL }}
                    value={{ text: subEvent.private_info }}
                />
            </Properties>
        </SubEventBox>
    );
};
