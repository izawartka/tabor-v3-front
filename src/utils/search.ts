export const SEARCH_MIN_QUERY_LENGTH = 3;
export const SEARCH_QUERY_PARAM_KEY = 'q';

export const normalizeSearchQuery = (query: string): string => query.trim();

export const isSearchQueryActive = (
    query: string,
    minQueryLength = SEARCH_MIN_QUERY_LENGTH
): boolean => normalizeSearchQuery(query).length >= minQueryLength;

export const shouldReplaceSearchQuery = (currentQuery: string, nextQuery: string): boolean => {
    const isCurrentQueryEmpty = normalizeSearchQuery(currentQuery).length === 0;
    const isNextQueryEmpty = normalizeSearchQuery(nextQuery).length === 0;

    return isCurrentQueryEmpty === isNextQueryEmpty;
};
