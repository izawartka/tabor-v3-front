import {
    PHOTO_FILE_EXTENSION,
    REFRESH_TIMESTAMP_FILE_NAME,
    getApiUrl,
    getPhotoUrl,
    getRefreshTimestampUrl,
    getStaticJsonUrl,
    getThumbPhotoUrl
} from '../paths';

describe('paths utils', (): void => {
    describe('constants', (): void => {
        it('exports stable file constants', (): void => {
            expect(REFRESH_TIMESTAMP_FILE_NAME).toBe('refresh_timestamp.txt');
            expect(PHOTO_FILE_EXTENSION).toBe('.jpg');
        });
    });

    describe('getApiUrl', (): void => {
        it('builds API url with leading slash', (): void => {
            expect(getApiUrl('/search.php')).toMatch(/\/search\.php$/);
        });

        it('adds leading slash if missing', (): void => {
            expect(getApiUrl('search.php')).toMatch(/\/search\.php$/);
        });

        it('handles multiple leading slashes', (): void => {
            expect(getApiUrl('///search.php')).toMatch(/\/search\.php$/);
        });

        it('encodes special characters in path', (): void => {
            const url = getApiUrl('search with spaces.php');
            expect(url).toContain('search with spaces.php');
        });

        it('handles empty path', (): void => {
            expect(getApiUrl('')).toMatch(/\/$|\/$/);
        });
    });

    describe('getRefreshTimestampUrl', (): void => {
        it('returns url ending with refresh_timestamp.txt', (): void => {
            expect(getRefreshTimestampUrl()).toMatch(/\/refresh_timestamp\.txt$/);
        });

        it('returns consistent url on multiple calls', (): void => {
            expect(getRefreshTimestampUrl()).toBe(getRefreshTimestampUrl());
        });
    });

    describe('getStaticJsonUrl', (): void => {
        it('builds static JSON url without refresh timestamp', (): void => {
            expect(getStaticJsonUrl('/type/x.json')).toMatch(/\/type\/x\.json$/);
            expect(getStaticJsonUrl('type/x.json')).toMatch(/\/type\/x\.json$/);
        });

        it('adds refresh query parameter when timestamp provided', (): void => {
            const url = getStaticJsonUrl('type/x.json', 'a b');
            expect(url).toMatch(/\/type\/x\.json\?refresh=a%20b$/);
        });

        it('encodes special characters in refresh timestamp', (): void => {
            const url = getStaticJsonUrl('x.json', '2024-01-02 10:30:45');
            expect(url).toContain('refresh=');
            expect(url).toContain('%20');
        });

        it('handles multiple leading slashes in path', (): void => {
            expect(getStaticJsonUrl('///type/x.json')).toMatch(/\/type\/x\.json$/);
        });

        it('handles empty refresh timestamp as undefined', (): void => {
            const urlWithEmpty = getStaticJsonUrl('type/x.json', '');
            const urlWithoutParam = getStaticJsonUrl('type/x.json');
            expect(urlWithEmpty).toBe(urlWithoutParam);
        });

        it('preserves multiple query parameters correctly', (): void => {
            const url = getStaticJsonUrl('x.json', 'a b c');
            expect(url).toContain('refresh=a%20b%20c');
        });
    });

    describe('getThumbPhotoUrl', (): void => {
        it('returns null for null photo identifier', (): void => {
            expect(getThumbPhotoUrl(null)).toBeNull();
        });

        it('returns null for empty string', (): void => {
            expect(getThumbPhotoUrl('')).toBeNull();
        });

        it('builds photo url with numeric id', (): void => {
            expect(getThumbPhotoUrl('67')).toMatch(/67\.jpg$/);
        });

        it('encodes photo identifier', (): void => {
            const url = getThumbPhotoUrl('photo with spaces');
            expect(url).toContain('photo%20with%20spaces');
            expect(url).toMatch(/\.jpg$/);
        });

        it('handles special characters in photo id', (): void => {
            const url = getThumbPhotoUrl('id/with/slashes');
            expect(url).toContain('id%2Fwith%2Fslashes');
        });

        it('appends correct file extension', (): void => {
            const url = getThumbPhotoUrl('123');
            expect(url).toMatch(/\.jpg$/);
        });
    });

    describe('getPhotoUrl', (): void => {
        it('returns null for null photo identifier', (): void => {
            expect(getPhotoUrl(null)).toBeNull();
        });

        it('returns null for empty string', (): void => {
            expect(getPhotoUrl('')).toBeNull();
        });

        it('builds full-size photo url with numeric id', (): void => {
            expect(getPhotoUrl('67')).toMatch(/67\.jpg$/);
        });

        it('encodes photo identifier', (): void => {
            const url = getPhotoUrl('photo with spaces');
            expect(url).toContain('photo%20with%20spaces');
            expect(url).toMatch(/\.jpg$/);
        });

        it('handles special characters in photo id', (): void => {
            const url = getPhotoUrl('id/with/slashes');
            expect(url).toContain('id%2Fwith%2Fslashes');
        });

        it('appends correct file extension', (): void => {
            const url = getPhotoUrl('456');
            expect(url).toMatch(/\.jpg$/);
        });

        it('generates different urls for thumb vs full photo', (): void => {
            const thumbUrl = getThumbPhotoUrl('123');
            const fullUrl = getPhotoUrl('123');
            expect(thumbUrl).not.toBe(fullUrl);
            expect(thumbUrl).toContain('123.jpg');
            expect(fullUrl).toContain('123.jpg');
        });
    });
});
