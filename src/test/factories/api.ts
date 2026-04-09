import type {
    ApiEventGroup,
    ApiEventGroupListResponse,
    ApiEventMedia,
    ApiEventPlace,
    ApiEventTime,
    ApiLocoResponse,
    ApiLocoResponseMeta,
    ApiMergedEvent,
    ApiReference,
    ApiSearchResponse,
    ApiSubevent,
    ApiTypeResponse,
    ApiTypesResponse
} from '../../types/api';

export const createReference = (overrides: Partial<ApiReference> = {}): ApiReference => ({
    event_count: 7,
    thumb: '602',
    ...overrides
});

export const createEventGroup = (overrides: Partial<ApiEventGroup> = {}): ApiEventGroup => ({
    id: '1988cf65',
    display_name: 'EU07-005',
    event_count: 7,
    thumb: '602',
    ...overrides
});

export const createEventGroupListResponse = (
    overrides: Partial<ApiEventGroupListResponse> = {}
): ApiEventGroupListResponse => ({
    event_group_list_info: { event_count: overrides.event_groups?.length ?? 1 },
    event_groups: [createEventGroup()],
    ...overrides
});

export const createSearchResponse = (
    overrides: Partial<ApiSearchResponse> = {}
): ApiSearchResponse =>
    createEventGroupListResponse({
        ...overrides
    });

export const createEventMedia = (overrides: Partial<ApiEventMedia> = {}): ApiEventMedia => ({
    photo: '602',
    photo_fav: false,
    video: null,
    video_fav: false,
    ...overrides
});

export const createEventTime = (overrides: Partial<ApiEventTime> = {}): ApiEventTime => ({
    text: '2025.01.02 12:00',
    date: '2025.01.02',
    year: '2025',
    timestamp: 1735819200,
    ...overrides
});

export const createEventPlace = (overrides: Partial<ApiEventPlace> = {}): ApiEventPlace => ({
    text: 'Poznań Główny',
    is_main: true,
    name: 'Poznań Główny',
    id: 'poznań_główny',
    ...overrides
});

export const createSubevent = (overrides: Partial<ApiSubevent> = {}): ApiSubevent => ({
    loco: {
        type: 'siodemki',
        id: '1988cf65',
        sort: '5',
        series_no: '4E-005',
        class_no: 'EU07-005'
    },
    places: [createEventPlace()],
    direction: 'Kraków Główny',
    train: 'IC 1234',
    composition: 'pasażerskie',
    info: 'testowe info',
    private_info: 'prywatne info',
    ...overrides
});

export const createMergedEvent = (overrides: Partial<ApiMergedEvent> = {}): ApiMergedEvent => ({
    common: {
        media: createEventMedia(),
        time: createEventTime()
    },
    subevents: [createSubevent()],
    ...overrides
});

export const createTypesResponse = (overrides: Partial<ApiTypesResponse> = {}): ApiTypesResponse =>
    createEventGroupListResponse({
        ...overrides
    });

export const createTypeResponse = (overrides: Partial<ApiTypeResponse> = {}): ApiTypeResponse => ({
    ...createEventGroupListResponse(),
    type_info: {
        id: 'siodemki',
        display_name: 'si\u00f3demki'
    },
    ...overrides
});

export const createLocoMeta = (
    overrides: Partial<ApiLocoResponseMeta> = {}
): ApiLocoResponseMeta => ({
    type_info: {
        id: 'siodemki',
        display_name: 'si\u00f3demki',
        ref: {
            event_count: 292,
            thumb: '612'
        }
    },
    loco_info: {
        id: '1988cf65',
        sort: '5',
        series_no: '4E-005',
        class_no: 'EU07-005'
    },
    event_list_info: {
        event_count: 7
    },
    ...overrides
});

export const createLocoResponse = (overrides: Partial<ApiLocoResponse> = {}): ApiLocoResponse => ({
    items: [createMergedEvent()],
    meta: createLocoMeta(),
    pagination_info: { page_count: 1 },
    ...overrides
});
