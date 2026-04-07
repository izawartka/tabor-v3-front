const PROD_API_BASE_URL = 'https://maseuko.pl/txt/tabor/api3';
const PROD_API_STATIC_BASE_URL = 'https://maseuko.pl/txt/tabor/api3/static';
const PROD_THUMB_PHOTOS_URL = 'https://maseuko.pl/txt/tabor/thumbs_tabor3/foto';
const PROD_PHOTOS_URL = 'https://maseuko.pl/txt/tabor/foto';

export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? '/api' : PROD_API_BASE_URL);

export const API_STATIC_BASE_URL =
    import.meta.env.VITE_API_STATIC_BASE_URL ??
    (import.meta.env.DEV ? '/api-static' : PROD_API_STATIC_BASE_URL);

export const THUMB_PHOTOS_URL =
    import.meta.env.VITE_THUMB_PHOTOS_URL ??
    (import.meta.env.DEV ? '/thumb-photos' : PROD_THUMB_PHOTOS_URL);

export const PHOTOS_URL =
    import.meta.env.VITE_PHOTOS_URL ?? (import.meta.env.DEV ? '/photos' : PROD_PHOTOS_URL);
