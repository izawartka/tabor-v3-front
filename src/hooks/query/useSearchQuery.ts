import { useCallback } from 'react';
import {
    SEARCH_QUERY_PARAM_KEY,
    normalizeSearchQuery,
    shouldReplaceSearchQuery
} from '../../utils/search';
import { useUrlQueryParam } from './useUrlQueryParam';

interface UseSearchQueryOptions {
    queryParamKey?: string;
}

interface UseSearchQueryResult {
    query: string;
    setQuery: (nextQuery: string) => void;
}

export const useSearchQuery = ({
    queryParamKey = SEARCH_QUERY_PARAM_KEY
}: UseSearchQueryOptions = {}): UseSearchQueryResult => {
    const [query, setUrlQuery] = useUrlQueryParam(queryParamKey);

    const setQuery = useCallback(
        (nextQuery: string): void => {
            const replace = shouldReplaceSearchQuery(query, nextQuery);

            setUrlQuery(nextQuery, {
                replace,
                normalizeValue: normalizeSearchQuery
            });
        },
        [query, setUrlQuery]
    );

    return {
        query,
        setQuery
    };
};
