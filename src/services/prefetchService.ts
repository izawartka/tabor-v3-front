import {
    loadDatePage,
    loadFavPage,
    loadLocoPage,
    loadPlacePage,
    loadPlaces,
    loadTypeById,
    loadTypes,
    loadYear,
    loadYears
} from './apiService';

const decodeSegment = (segment: string): string => {
    try {
        return decodeURIComponent(segment);
    } catch {
        return segment;
    }
};

const normalizePath = (path: string): string => path.split('?')[0].split('#')[0];

export const prefetchRouteData = (path: string, refreshTimestamp: string): void => {
    const normalizedPath = normalizePath(path);

    if (normalizedPath === '/' || normalizedPath === '/types') {
        void loadTypes(refreshTimestamp);
        return;
    }

    if (normalizedPath === '/years') {
        void loadYears(refreshTimestamp);
        return;
    }

    if (normalizedPath === '/places') {
        void loadPlaces(refreshTimestamp);
        return;
    }

    if (normalizedPath === '/fav') {
        void loadFavPage(0, refreshTimestamp);
        return;
    }

    const segments = normalizedPath.split('/').filter(Boolean);

    if (segments.length !== 2) {
        return;
    }

    const [resource, rawId] = segments;
    const id = decodeSegment(rawId);

    switch (resource) {
        case 'type':
            void loadTypeById(id, refreshTimestamp);
            return;
        case 'loco':
            void loadLocoPage(id, 0, refreshTimestamp);
            return;
        case 'year':
            void loadYear(id, refreshTimestamp);
            return;
        case 'date':
            void loadDatePage(id, 0, refreshTimestamp);
            return;
        case 'place':
            void loadPlacePage(id, 0, refreshTimestamp);
            return;
        default:
            return;
    }
};
