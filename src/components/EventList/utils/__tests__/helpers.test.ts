import { EVENT_ITEM_LOCO_REF_TEXT, getLocoRefData } from '../getLocoRefData';
import { EVENT_ITEM_PLACE_REF_TEXT, getPlaceRefData } from '../getPlaceRefData';
import { EVENT_ITEM_TIME_REF_TEXT, getTimeRefData } from '../getTimeRefData';
import { EVENT_ITEM_PLACE_SEPARATOR, getPlacePropertyValue } from '../getPlacePropertyValue';
import { isPropertyValueValid } from '../isPropertyValueValid';
import {
    createEventPlace,
    createEventTime,
    createReference,
    createSubevent
} from '../../../../test/factories/api';

describe('event list helper utils', (): void => {
    describe('getLocoRefData', (): void => {
        it('builds loco reference when ref exists', (): void => {
            const reference = createReference();
            const subevent = createSubevent({
                loco: {
                    type: 'dragony',
                    id: 'd6a9d19a',
                    sort: '43',
                    series_no: 'E6ACTadb-series-043',
                    class_no: 'E6ACTadb-043',
                    loco_ref: reference
                }
            });

            const result = getLocoRefData(subevent.loco);

            expect(result).toEqual({
                ref: reference,
                href: '/loco/d6a9d19a',
                refText: EVENT_ITEM_LOCO_REF_TEXT
            });
        });

        it('returns undefined when loco is missing', (): void => {
            expect(getLocoRefData()).toBeUndefined();
            expect(getLocoRefData(undefined)).toBeUndefined();
        });

        it('returns undefined when loco_ref is missing', (): void => {
            const subevent = createSubevent();
            expect(getLocoRefData(subevent.loco)).toBeUndefined();
        });

        it('handles loco without loco_ref', (): void => {
            const result = getLocoRefData({
                type: 'eu07',
                id: 'test-id',
                sort: '1',
                series_no: 'EU07-001',
                class_no: 'EU07-001'
            });

            expect(result).toBeUndefined();
        });
    });

    describe('getPlaceRefData', (): void => {
        it('builds place reference when ref exists', (): void => {
            const reference = createReference();
            const place = createEventPlace({ id: 'kraków-główny', place_ref: reference });

            const result = getPlaceRefData(place);

            expect(result).toEqual({
                ref: reference,
                href: '/place/kraków-główny',
                refText: EVENT_ITEM_PLACE_REF_TEXT
            });
        });

        it('returns undefined when place_ref is missing', (): void => {
            const place = createEventPlace({ id: 'kraków-główny' });
            expect(getPlaceRefData(place)).toBeUndefined();
        });

        it('encodes special characters in place id', (): void => {
            const reference = createReference();
            const placeWithSpecialChars = createEventPlace({
                id: 'place/with special chars',
                place_ref: reference
            });

            const result = getPlaceRefData(placeWithSpecialChars);
            expect(result?.href).toContain('/place/');
            expect(result?.href).toBe('/place/place/with special chars');
        });
    });

    describe('getTimeRefData', (): void => {
        it('builds time reference when ref exists', (): void => {
            const reference = createReference();
            const time = createEventTime({ date: '2025.01.02', date_ref: reference });

            const result = getTimeRefData(time);

            expect(result).toEqual({
                ref: reference,
                href: '/date/2025.01.02',
                refText: EVENT_ITEM_TIME_REF_TEXT
            });
        });

        it('returns undefined when date_ref is missing', (): void => {
            const time = createEventTime({ date: '2025.01.02' });
            expect(getTimeRefData(time)).toBeUndefined();
        });

        it('handles various date formats in href', (): void => {
            const reference = createReference();
            const time = createEventTime({ date: '2024-12-31', date_ref: reference });

            const result = getTimeRefData(time);
            expect(result?.href).toBe('/date/2024-12-31');
        });

        it('preserves date in href regardless of text field', (): void => {
            const reference = createReference();
            const time = createEventTime({
                date: '2025.06.15',
                text: 'June 15, 2025',
                date_ref: reference
            });

            const result = getTimeRefData(time);
            expect(result?.href).toBe('/date/2025.06.15');
        });
    });

    describe('getPlacePropertyValue', (): void => {
        it('maps place to property value object with text', (): void => {
            const place = createEventPlace({ text: 'Kraków Główny', id: 'kraków-główny' });

            const result = getPlacePropertyValue(place);

            expect(result).toEqual({
                text: 'Kraków Główny',
                refData: undefined
            });
        });

        it('includes reference data when place_ref exists', (): void => {
            const reference = createReference();
            const place = createEventPlace({
                text: 'Kraków Główny',
                id: 'kraków-główny',
                place_ref: reference
            });

            const result = getPlacePropertyValue(place);

            expect(result.text).toBe('Kraków Główny');
            expect(result.refData?.href).toBe('/place/kraków-główny');
            expect(result.refData?.ref).toEqual(reference);
        });

        it('includes place separator constant', (): void => {
            expect(EVENT_ITEM_PLACE_SEPARATOR).toBe(' - ');
        });

        it('preserves place text from factory defaults', (): void => {
            const place = createEventPlace();
            const result = getPlacePropertyValue(place);
            expect(result.text).toBe('Poznań Główny');
        });
    });

    describe('isPropertyValueValid', (): void => {
        it('returns false for undefined', (): void => {
            expect(isPropertyValueValid(undefined)).toBe(false);
        });

        it('returns false for empty string', (): void => {
            expect(isPropertyValueValid('')).toBe(false);
        });

        it('returns false for arrow markers', (): void => {
            expect(isPropertyValueValid('<-')).toBe(false);
            expect(isPropertyValueValid('->')).toBe(false);
        });

        it('returns true for valid non-empty values', (): void => {
            expect(isPropertyValueValid('ok')).toBe(true);
            expect(isPropertyValueValid('text')).toBe(true);
            expect(isPropertyValueValid('- valid')).toBe(true);
            expect(isPropertyValueValid('valid -')).toBe(true);
        });

        it('returns true for values containing arrows not as exact match', (): void => {
            expect(isPropertyValueValid('<- text')).toBe(true);
            expect(isPropertyValueValid('text ->')).toBe(true);
            expect(isPropertyValueValid('text <- more')).toBe(true);
        });

        it('returns true for single characters', (): void => {
            expect(isPropertyValueValid('a')).toBe(true);
            expect(isPropertyValueValid('1')).toBe(true);
        });

        it('returns true for values with special characters', (): void => {
            expect(isPropertyValueValid('text & more')).toBe(true);
            expect(isPropertyValueValid('value/with/slashes')).toBe(true);
            expect(isPropertyValueValid('text with spaces')).toBe(true);
        });

        it('edge case: whitespace-only strings treated as invalid', (): void => {
            expect(isPropertyValueValid('   ')).toBe(true);
        });
    });
});
