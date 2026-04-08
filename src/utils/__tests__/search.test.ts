import {
    SEARCH_MIN_QUERY_LENGTH,
    SEARCH_QUERY_PARAM_KEY,
    isSearchQueryActive,
    normalizeSearchQuery,
    shouldReplaceSearchQuery
} from '../search';

describe('search utils', (): void => {
    describe('constants', (): void => {
        it('exports stable defaults', (): void => {
            expect(SEARCH_MIN_QUERY_LENGTH).toBe(3);
            expect(SEARCH_QUERY_PARAM_KEY).toBe('q');
        });
    });

    describe('normalizeSearchQuery', (): void => {
        it('trims leading and trailing whitespace', (): void => {
            expect(normalizeSearchQuery('  ET22  ')).toBe('ET22');
            expect(normalizeSearchQuery('\t\n abc \r\n')).toBe('abc');
        });

        it('preserves internal whitespace', (): void => {
            expect(normalizeSearchQuery('ET 22')).toBe('ET 22');
            expect(normalizeSearchQuery('  hello world  ')).toBe('hello world');
        });

        it('handles empty strings', (): void => {
            expect(normalizeSearchQuery('')).toBe('');
            expect(normalizeSearchQuery('   ')).toBe('');
        });

        it('preserves case', (): void => {
            expect(normalizeSearchQuery('  AbC123  ')).toBe('AbC123');
        });
    });

    describe('isSearchQueryActive', (): void => {
        it('returns false for queries shorter than default minimum length', (): void => {
            expect(isSearchQueryActive('')).toBe(false);
            expect(isSearchQueryActive('a')).toBe(false);
            expect(isSearchQueryActive('ab')).toBe(false);
            expect(isSearchQueryActive('  ab  ')).toBe(false);
        });

        it('returns true for queries meeting or exceeding minimum length', (): void => {
            expect(isSearchQueryActive('abc')).toBe(true);
            expect(isSearchQueryActive('  abc  ')).toBe(true);
            expect(isSearchQueryActive('abcd')).toBe(true);
        });

        it('respects custom minimum length parameter', (): void => {
            expect(isSearchQueryActive('abc', 4)).toBe(false);
            expect(isSearchQueryActive('abcd', 4)).toBe(true);
            expect(isSearchQueryActive('ab', 1)).toBe(true);
        });

        it('normalizes query before checking length', (): void => {
            expect(isSearchQueryActive('  x  ', 1)).toBe(true);
            expect(isSearchQueryActive('   ', 1)).toBe(false);
        });
    });

    describe('shouldReplaceSearchQuery', (): void => {
        it('returns true when both queries are empty', (): void => {
            expect(shouldReplaceSearchQuery('', '')).toBe(true);
            expect(shouldReplaceSearchQuery('  ', '')).toBe(true);
            expect(shouldReplaceSearchQuery('', '   ')).toBe(true);
            expect(shouldReplaceSearchQuery('   ', '   ')).toBe(true);
        });

        it('returns true when both queries are non-empty', (): void => {
            expect(shouldReplaceSearchQuery('a', 'b')).toBe(true);
            expect(shouldReplaceSearchQuery(' a ', 'b')).toBe(true);
            expect(shouldReplaceSearchQuery('query1', 'query2')).toBe(true);
            expect(shouldReplaceSearchQuery('  query  ', 'another')).toBe(true);
        });

        it('returns false when transitioning from empty to non-empty', (): void => {
            expect(shouldReplaceSearchQuery('', 'abc')).toBe(false);
            expect(shouldReplaceSearchQuery('   ', 'query')).toBe(false);
        });

        it('returns false when transitioning from non-empty to empty', (): void => {
            expect(shouldReplaceSearchQuery('abc', '')).toBe(false);
            expect(shouldReplaceSearchQuery('query', '  ')).toBe(false);
            expect(shouldReplaceSearchQuery('abc', '   ')).toBe(false);
        });

        it('handles identical queries correctly', (): void => {
            expect(shouldReplaceSearchQuery('query', 'query')).toBe(true);
            expect(shouldReplaceSearchQuery('  query  ', '  query  ')).toBe(true);
        });
    });
});
