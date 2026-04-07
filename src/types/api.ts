export interface ApiEventGroupListInfo {
    event_count: number;
}

export interface ApiEventGroup {
    id: string;
    display_name: string;
    event_count: number;
    thumb: string | null;
}

export interface ApiEventGroupListResponse {
    event_group_list_info: ApiEventGroupListInfo;
    event_groups: ApiEventGroup[];
}

export interface ApiReference {
    event_count: number;
    thumb: string | null;
}

export interface ApiEventMedia {
    photo: string | null;
    photo_fav: boolean;
    video: string | null;
    video_fav: boolean;
}

export interface ApiEventTime {
    text: string;
    date: string;
    year: string;
    timestamp: number;
    date_ref?: ApiReference;
}

export interface ApiEventLoco {
    type: string;
    id: string;
    sort: string;
    series_no: string;
    class_no: string;
    loco_ref?: ApiReference;
}

export interface ApiEventPlace {
    text: string;
    is_main: boolean;
    name: string;
    id: string;
    place_ref?: ApiReference;
}

export interface ApiSubevent {
    loco?: ApiEventLoco;
    places: ApiEventPlace[];
    direction: string;
    train: string;
    composition: string;
    info: string;
    private_info: string;
}

export interface ApiEventCommon {
    media: ApiEventMedia;
    time: ApiEventTime;
}

export interface ApiMergedEvent {
    common: ApiEventCommon;
    subevents: ApiSubevent[];
}

export interface ApiPaginationInfo {
    page_count: number;
}

export interface ApiPaginatedResponseEveryPage<ItemT> {
    items: ItemT[];
}

export interface ApiPaginatedResponseFirstPage<
    ItemT,
    MetaT
> extends ApiPaginatedResponseEveryPage<ItemT> {
    meta: MetaT;
    pagination_info: ApiPaginationInfo;
}

export type ApiPaginatedResponse<ItemT, MetaT> =
    | ApiPaginatedResponseFirstPage<ItemT, MetaT>
    | ApiPaginatedResponseEveryPage<ItemT>;

export interface ApiEventListInfo {
    event_count: number;
    events_with_media_count: number;
}

export interface ApiEventListResponseMeta {
    event_list_info: ApiEventListInfo;
}

export type ApiEventListFirstPageResponse<MetaT extends ApiEventListResponseMeta> =
    ApiPaginatedResponseFirstPage<ApiMergedEvent, MetaT>;
export type ApiEventListEveryPageResponse = ApiPaginatedResponseEveryPage<ApiMergedEvent>;
export type ApiEventListResponse<MetaT extends ApiEventListResponseMeta> =
    | ApiEventListFirstPageResponse<MetaT>
    | ApiEventListEveryPageResponse;

export interface ApiTypeInfo {
    id: string;
    display_name: string;
    ref?: ApiReference;
}

export interface ApiLocoInfo {
    id: string;
    sort: string;
    series_no: string;
    class_no: string;
}

export type ApiTypesResponse = ApiEventGroupListResponse;

export interface ApiTypeResponse extends ApiEventGroupListResponse {
    type_info: ApiTypeInfo;
}

export interface ApiLocoResponseMeta extends ApiEventListResponseMeta {
    loco_info: ApiLocoInfo;
    type_info: ApiTypeInfo;
}

export type ApiLocoFirstPageResponse = ApiPaginatedResponseFirstPage<
    ApiMergedEvent,
    ApiLocoResponseMeta
>;
export type ApiLocoEveryPageResponse = ApiPaginatedResponseEveryPage<ApiMergedEvent>;
export type ApiLocoResponse = ApiLocoFirstPageResponse | ApiLocoEveryPageResponse;
