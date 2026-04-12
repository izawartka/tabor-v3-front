import { prefetchRouteData } from '../prefetchService';
import * as apiService from '../apiService';

vi.mock('../apiService', () => ({
    loadTypes: vi.fn(),
    loadTypeById: vi.fn(),
    loadLocoPage: vi.fn(),
    loadYears: vi.fn(),
    loadYear: vi.fn(),
    loadDatePage: vi.fn(),
    loadPlaces: vi.fn(),
    loadPlacePage: vi.fn(),
    loadFavPage: vi.fn()
}));

describe('prefetchService', (): void => {
    const refreshTimestamp = '123';

    beforeEach((): void => {
        vi.clearAllMocks();
    });

    it('prefetches list routes', (): void => {
        prefetchRouteData('/', refreshTimestamp);
        prefetchRouteData('/types', refreshTimestamp);
        prefetchRouteData('/years', refreshTimestamp);
        prefetchRouteData('/places', refreshTimestamp);
        prefetchRouteData('/fav', refreshTimestamp);

        expect(apiService.loadTypes).toHaveBeenCalledTimes(2);
        expect(apiService.loadTypes).toHaveBeenNthCalledWith(1, refreshTimestamp);
        expect(apiService.loadTypes).toHaveBeenNthCalledWith(2, refreshTimestamp);
        expect(apiService.loadYears).toHaveBeenCalledWith(refreshTimestamp);
        expect(apiService.loadPlaces).toHaveBeenCalledWith(refreshTimestamp);
        expect(apiService.loadFavPage).toHaveBeenCalledWith(0, refreshTimestamp);
    });

    it('prefetches detail routes and decodes encoded path segments', (): void => {
        prefetchRouteData('/type/ET22%2F2000', refreshTimestamp);
        prefetchRouteData('/loco/SM42%201234', refreshTimestamp);
        prefetchRouteData('/year/2025', refreshTimestamp);
        prefetchRouteData('/date/2025.01.02', refreshTimestamp);
        prefetchRouteData('/place/krak%C3%B3w_prokocim_towarowy', refreshTimestamp);

        expect(apiService.loadTypeById).toHaveBeenCalledWith('ET22/2000', refreshTimestamp);
        expect(apiService.loadLocoPage).toHaveBeenCalledWith('SM42 1234', 0, refreshTimestamp);
        expect(apiService.loadYear).toHaveBeenCalledWith('2025', refreshTimestamp);
        expect(apiService.loadDatePage).toHaveBeenCalledWith('2025.01.02', 0, refreshTimestamp);
        expect(apiService.loadPlacePage).toHaveBeenCalledWith(
            'kraków_prokocim_towarowy',
            0,
            refreshTimestamp
        );
    });

    it('ignores query string and hash in route path', (): void => {
        prefetchRouteData('/loco/eu07?foo=bar#section', refreshTimestamp);

        expect(apiService.loadLocoPage).toHaveBeenCalledWith('eu07', 0, refreshTimestamp);
    });

    it('does nothing for unknown or unsupported routes', (): void => {
        prefetchRouteData('/unknown', refreshTimestamp);
        prefetchRouteData('/type', refreshTimestamp);
        prefetchRouteData('/type/a/b', refreshTimestamp);

        expect(apiService.loadTypes).not.toHaveBeenCalled();
        expect(apiService.loadTypeById).not.toHaveBeenCalled();
        expect(apiService.loadLocoPage).not.toHaveBeenCalled();
        expect(apiService.loadYear).not.toHaveBeenCalled();
        expect(apiService.loadDatePage).not.toHaveBeenCalled();
        expect(apiService.loadPlacePage).not.toHaveBeenCalled();
        expect(apiService.loadYears).not.toHaveBeenCalled();
        expect(apiService.loadPlaces).not.toHaveBeenCalled();
        expect(apiService.loadFavPage).not.toHaveBeenCalled();
    });

    it('handles malformed URI segments gracefully', (): void => {
        prefetchRouteData('/type/%E0%A4%A', refreshTimestamp);

        expect(apiService.loadTypeById).toHaveBeenCalledWith('%E0%A4%A', refreshTimestamp);
    });
});
