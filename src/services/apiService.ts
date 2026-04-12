import { fetchText } from './httpService';
import { getApiUrl, getRefreshTimestampUrl, getStaticJsonUrl } from '../utils/paths';
import type {
    ApiDateResponse,
    ApiFavResponse,
    ApiLocoResponse,
    ApiPlaceResponse,
    ApiPlacesResponse,
    ApiSearchResponse,
    ApiTypeResponse,
    ApiTypesResponse,
    ApiYearResponse,
    ApiYearsResponse
} from '../types/api';
import { hasCachedJson, loadCachedJson } from './cacheService';

export const loadRefreshTimestamp = async (signal?: AbortSignal): Promise<string> => {
    const value = await fetchText(getRefreshTimestampUrl(), { signal, cache: 'no-store' });
    return value.trim();
};

export const loadTypes = (
    refreshTimestamp: string,
    signal?: AbortSignal
): Promise<ApiTypesResponse> =>
    loadCachedJson<ApiTypesResponse>(getStaticJsonUrl('types.json', refreshTimestamp), signal);

export const loadTypeById = (
    typeId: string,
    refreshTimestamp: string,
    signal?: AbortSignal
): Promise<ApiTypeResponse> =>
    loadCachedJson<ApiTypeResponse>(
        getStaticJsonUrl(`type/${encodeURIComponent(typeId)}.json`, refreshTimestamp),
        signal
    );

export const loadLocoPage = (
    locoId: string,
    page: number,
    refreshTimestamp: string,
    signal?: AbortSignal
): Promise<ApiLocoResponse> => {
    const suffix = page === 0 ? '' : `_page_${page}`;

    return loadCachedJson<ApiLocoResponse>(
        getStaticJsonUrl(`loco/${encodeURIComponent(locoId)}${suffix}.json`, refreshTimestamp),
        signal
    );
};

export const isLocoPageCached = (
    locoId: string,
    page: number,
    refreshTimestamp: string
): boolean => {
    const suffix = page === 0 ? '' : `_page_${page}`;

    return hasCachedJson(
        getStaticJsonUrl(`loco/${encodeURIComponent(locoId)}${suffix}.json`, refreshTimestamp)
    );
};

export const loadYears = (
    refreshTimestamp: string,
    signal?: AbortSignal
): Promise<ApiYearsResponse> =>
    loadCachedJson<ApiYearsResponse>(getStaticJsonUrl('years.json', refreshTimestamp), signal);

export const loadYear = (
    year: string,
    refreshTimestamp: string,
    signal?: AbortSignal
): Promise<ApiYearResponse> =>
    loadCachedJson<ApiYearResponse>(
        getStaticJsonUrl(`year/${encodeURIComponent(year)}.json`, refreshTimestamp),
        signal
    );

export const loadDatePage = (
    date: string,
    page: number,
    refreshTimestamp: string,
    signal?: AbortSignal
): Promise<ApiDateResponse> => {
    const suffix = page === 0 ? '' : `_page_${page}`;

    return loadCachedJson<ApiDateResponse>(
        getStaticJsonUrl(`date/${encodeURIComponent(date)}${suffix}.json`, refreshTimestamp),
        signal
    );
};

export const isDatePageCached = (date: string, page: number, refreshTimestamp: string): boolean => {
    const suffix = page === 0 ? '' : `_page_${page}`;

    return hasCachedJson(
        getStaticJsonUrl(`date/${encodeURIComponent(date)}${suffix}.json`, refreshTimestamp)
    );
};

export const loadPlaces = (
    refreshTimestamp: string,
    signal?: AbortSignal
): Promise<ApiPlacesResponse> =>
    loadCachedJson<ApiPlacesResponse>(getStaticJsonUrl('places.json', refreshTimestamp), signal);

export const loadPlacePage = (
    placeId: string,
    page: number,
    refreshTimestamp: string,
    signal?: AbortSignal
): Promise<ApiPlaceResponse> => {
    const suffix = page === 0 ? '' : `_page_${page}`;

    return loadCachedJson<ApiPlaceResponse>(
        getStaticJsonUrl(`place/${encodeURIComponent(placeId)}${suffix}.json`, refreshTimestamp),
        signal
    );
};

export const isPlacePageCached = (
    placeId: string,
    page: number,
    refreshTimestamp: string
): boolean => {
    const suffix = page === 0 ? '' : `_page_${page}`;

    return hasCachedJson(
        getStaticJsonUrl(`place/${encodeURIComponent(placeId)}${suffix}.json`, refreshTimestamp)
    );
};

export const loadFavPage = (
    page: number,
    refreshTimestamp: string,
    signal?: AbortSignal
): Promise<ApiFavResponse> => {
    const suffix = page === 0 ? '' : `_page_${page}`;

    return loadCachedJson<ApiFavResponse>(
        getStaticJsonUrl(`fav_events${suffix}.json`, refreshTimestamp),
        signal
    );
};

export const isFavPageCached = (page: number, refreshTimestamp: string): boolean => {
    const suffix = page === 0 ? '' : `_page_${page}`;

    return hasCachedJson(getStaticJsonUrl(`fav_events${suffix}.json`, refreshTimestamp));
};

export const searchEventGroups = (
    endpoint: string,
    query: string,
    signal?: AbortSignal
): Promise<ApiSearchResponse> =>
    loadCachedJson<ApiSearchResponse>(
        getApiUrl(`${endpoint}?query=${encodeURIComponent(query)}`),
        signal
    );

export const searchLocos = (query: string, signal?: AbortSignal): Promise<ApiSearchResponse> =>
    searchEventGroups('search_loco.php', query, signal);

export const searchPlaces = (query: string, signal?: AbortSignal): Promise<ApiSearchResponse> =>
    searchEventGroups('search_place.php', query, signal);

export const searchDates = (query: string, signal?: AbortSignal): Promise<ApiSearchResponse> =>
    searchEventGroups('search_date.php', query, signal);
