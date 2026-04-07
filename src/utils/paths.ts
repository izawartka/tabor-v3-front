import { API_BASE_URL, API_STATIC_BASE_URL, PHOTOS_URL, THUMB_PHOTOS_URL } from '../config';

export const REFRESH_TIMESTAMP_FILE_NAME = 'refresh_timestamp.txt';
export const PHOTO_FILE_EXTENSION = '.jpg';

const trimSlash = (value: string): string => value.replace(/\/+$/, '');

const apiBase = trimSlash(API_BASE_URL);
const staticBase = trimSlash(API_STATIC_BASE_URL);
const thumbsBase = trimSlash(THUMB_PHOTOS_URL);
const photosBase = trimSlash(PHOTOS_URL);

export const getApiUrl = (path: string): string => {
    const cleanPath = path.replace(/^\/+/, '');
    return `${apiBase}/${cleanPath}`;
};

export const getRefreshTimestampUrl = (): string => `${staticBase}/${REFRESH_TIMESTAMP_FILE_NAME}`;

export const getStaticJsonUrl = (path: string, refreshTimestamp?: string): string => {
    const cleanPath = path.replace(/^\/+/, '');
    const url = `${staticBase}/${cleanPath}`;

    if (!refreshTimestamp) {
        return url;
    }

    return `${url}?refresh=${encodeURIComponent(refreshTimestamp)}`;
};

export const getThumbPhotoUrl = (photoId: string | null): string | null => {
    if (photoId === null || photoId === '') {
        return null;
    }

    return `${thumbsBase}/${encodeURIComponent(photoId)}${PHOTO_FILE_EXTENSION}`;
};

export const getPhotoUrl = (photoId: string | null): string | null => {
    if (photoId === null || photoId === '') {
        return null;
    }

    return `${photosBase}/${encodeURIComponent(photoId)}${PHOTO_FILE_EXTENSION}`;
};
