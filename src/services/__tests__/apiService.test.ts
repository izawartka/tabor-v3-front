import {
    loadDatePage,
    loadFavPage,
    loadLocoPage,
    loadPlacePage,
    loadPlaces,
    loadRefreshTimestamp,
    loadTypeById,
    loadTypes,
    loadYear,
    loadYears,
    searchDates,
    searchEventGroups,
    searchLocos,
    searchPlaces
} from '../apiService';
import * as httpService from '../httpService';

vi.mock('../httpService', () => ({
    fetchJson: vi.fn(),
    fetchText: vi.fn()
}));

describe('apiService', (): void => {
    beforeEach((): void => {
        vi.clearAllMocks();
    });

    describe('loadRefreshTimestamp', (): void => {
        it('loads and trims refresh timestamp', async (): Promise<void> => {
            vi.mocked(httpService.fetchText).mockResolvedValueOnce(' 123 ');

            const result = await loadRefreshTimestamp();

            expect(result).toBe('123');
            expect(httpService.fetchText).toHaveBeenCalled();
        });

        it('handles empty timestamp', async (): Promise<void> => {
            vi.mocked(httpService.fetchText).mockResolvedValueOnce('   ');

            const result = await loadRefreshTimestamp();

            expect(result).toBe('');
        });

        it('passes AbortSignal to fetchText', async (): Promise<void> => {
            vi.mocked(httpService.fetchText).mockResolvedValueOnce('timestamp');

            const controller = new AbortController();
            await loadRefreshTimestamp(controller.signal);

            expect(httpService.fetchText).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ signal: controller.signal })
            );
        });

        it('propagates fetchText errors', async (): Promise<void> => {
            const error = new Error('Network error');
            vi.mocked(httpService.fetchText).mockRejectedValueOnce(error);

            await expect(loadRefreshTimestamp()).rejects.toThrow('Network error');
        });
    });

    describe('loadTypes', (): void => {
        it('calls static endpoint with refresh timestamp', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            await loadTypes('123');

            expect(httpService.fetchJson).toHaveBeenCalledWith(
                expect.stringContaining('types.json?refresh=123'),
                expect.objectContaining({ signal: undefined })
            );
        });

        it('passes AbortSignal to fetchJson', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            const controller = new AbortController();
            await loadTypes('timestamp', controller.signal);

            expect(httpService.fetchJson).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ signal: controller.signal })
            );
        });

        it('encodes refresh timestamp in URL', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            await loadTypes('a b c');

            const call = vi.mocked(httpService.fetchJson).mock.calls[0];
            expect(call[0]).toContain('refresh=');
            expect(call[0]).toContain('%20');
        });
    });

    describe('loadTypeById', (): void => {
        it('builds URL with encoded type ID and refresh timestamp', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            await loadTypeById('byczki', '123');

            const url = vi.mocked(httpService.fetchJson).mock.calls[0][0];
            expect(url).toContain('type/byczki.json?refresh=123');
        });

        it('encodes special characters in type ID', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            await loadTypeById('type/with spaces', 'ts');

            const url = vi.mocked(httpService.fetchJson).mock.calls[0][0];
            expect(url).toContain('type/');
            expect(url).toContain('type%2Fwith%20spaces');
        });

        it('passes AbortSignal to fetchJson', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            const controller = new AbortController();
            await loadTypeById('type-id', 'timestamp', controller.signal);

            expect(httpService.fetchJson).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ signal: controller.signal })
            );
        });
    });

    describe('loadLocoPage', (): void => {
        it('builds URL for first page (page 0)', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            await loadLocoPage('1988cf65', 0, '123');

            const url = vi.mocked(httpService.fetchJson).mock.calls[0][0];
            expect(url).toContain('loco/1988cf65.json?refresh=123');
            expect(url).not.toContain('_page_');
        });

        it('builds URL for subsequent pages with page suffix', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            await loadLocoPage('1988cf65', 1, '123');
            await loadLocoPage('1988cf65', 5, 'ts');

            const call1 = vi.mocked(httpService.fetchJson).mock.calls[0][0];
            const call2 = vi.mocked(httpService.fetchJson).mock.calls[1][0];

            expect(call1).toContain('loco/1988cf65_page_1.json');
            expect(call2).toContain('loco/1988cf65_page_5.json');
        });

        it('encodes special characters in loco ID', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            await loadLocoPage('loco/with spaces', 0, 'ts');

            const url = vi.mocked(httpService.fetchJson).mock.calls[0][0];
            expect(url).toContain('loco%2Fwith%20spaces');
        });

        it('passes AbortSignal to fetchJson', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            const controller = new AbortController();
            await loadLocoPage('loco-id', 0, 'timestamp', controller.signal);

            expect(httpService.fetchJson).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ signal: controller.signal })
            );
        });
    });

    describe('loadYears', (): void => {
        it('builds years URL with refresh timestamp', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            await loadYears('123');

            const url = vi.mocked(httpService.fetchJson).mock.calls[0][0];
            expect(url).toContain('years.json?refresh=123');
        });

        it('passes AbortSignal to fetchJson', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            const controller = new AbortController();
            await loadYears('timestamp', controller.signal);

            expect(httpService.fetchJson).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ signal: controller.signal })
            );
        });
    });

    describe('loadYear', (): void => {
        it('builds year URL with encoded year and refresh timestamp', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            await loadYear('2025', '123');

            const url = vi.mocked(httpService.fetchJson).mock.calls[0][0];
            expect(url).toContain('year/2025.json?refresh=123');
        });

        it('encodes special characters in year path segment', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            await loadYear('2025/extra', 'ts');

            const url = vi.mocked(httpService.fetchJson).mock.calls[0][0];
            expect(url).toContain('year/2025%2Fextra.json');
        });
    });

    describe('loadDatePage', (): void => {
        it('builds URL for first date page without suffix', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            await loadDatePage('2025.01.02', 0, '123');

            const url = vi.mocked(httpService.fetchJson).mock.calls[0][0];
            expect(url).toContain('date/2025.01.02.json?refresh=123');
            expect(url).not.toContain('_page_');
        });

        it('builds URL with page suffix for subsequent date pages', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            await loadDatePage('2025.01.02', 2, '123');

            const url = vi.mocked(httpService.fetchJson).mock.calls[0][0];
            expect(url).toContain('date/2025.01.02_page_2.json?refresh=123');
        });

        it('passes AbortSignal through', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            const controller = new AbortController();
            await loadDatePage('2025.01.02', 0, 'ts', controller.signal);

            expect(httpService.fetchJson).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ signal: controller.signal })
            );
        });
    });

    describe('loadPlaces', (): void => {
        it('builds places URL with refresh timestamp', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            await loadPlaces('123');

            const url = vi.mocked(httpService.fetchJson).mock.calls[0][0];
            expect(url).toContain('places.json?refresh=123');
        });

        it('passes AbortSignal to fetchJson', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            const controller = new AbortController();
            await loadPlaces('timestamp', controller.signal);

            expect(httpService.fetchJson).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ signal: controller.signal })
            );
        });
    });

    describe('loadPlacePage', (): void => {
        it('builds URL for first place page without suffix', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            await loadPlacePage('katowice', 0, '123');

            const url = vi.mocked(httpService.fetchJson).mock.calls[0][0];
            expect(url).toContain('place/katowice.json?refresh=123');
            expect(url).not.toContain('_page_');
        });

        it('builds URL with page suffix for subsequent place pages', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            await loadPlacePage('katowice', 3, '123');

            const url = vi.mocked(httpService.fetchJson).mock.calls[0][0];
            expect(url).toContain('place/katowice_page_3.json?refresh=123');
        });

        it('encodes special characters in place ID', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            await loadPlacePage('poznań_główny', 0, 'ts');

            const url = vi.mocked(httpService.fetchJson).mock.calls[0][0];
            expect(url).toContain('place/pozna%C5%84_g%C5%82%C3%B3wny.json');
        });

        it('passes AbortSignal through', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            const controller = new AbortController();
            await loadPlacePage('poznań_główny', 0, 'ts', controller.signal);

            expect(httpService.fetchJson).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ signal: controller.signal })
            );
        });
    });

    describe('loadFavPage', (): void => {
        it('builds URL for first fav page without suffix', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            await loadFavPage(0, '123');

            const url = vi.mocked(httpService.fetchJson).mock.calls[0][0];
            expect(url).toContain('fav_events.json?refresh=123');
            expect(url).not.toContain('_page_');
        });

        it('builds URL with page suffix for subsequent fav pages', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            await loadFavPage(4, '123');

            const url = vi.mocked(httpService.fetchJson).mock.calls[0][0];
            expect(url).toContain('fav_events_page_4.json?refresh=123');
        });

        it('passes AbortSignal through', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            const controller = new AbortController();
            await loadFavPage(0, 'ts', controller.signal);

            expect(httpService.fetchJson).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ signal: controller.signal })
            );
        });
    });

    describe('searchEventGroups', (): void => {
        it('builds search URL with endpoint and query', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            await searchEventGroups('search_loco.php', 'ET22');

            const url = vi.mocked(httpService.fetchJson).mock.calls[0][0];
            expect(url).toContain('search_loco.php');
            expect(url).toContain('query=ET22');
        });

        it('encodes special characters in query', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            await searchEventGroups('search_loco.php', 'ET22 test');

            const url = vi.mocked(httpService.fetchJson).mock.calls[0][0];
            expect(url).toContain('query=ET22%20test');
        });

        it('passes AbortSignal to fetchJson', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            const controller = new AbortController();
            await searchEventGroups('endpoint', 'query', controller.signal);

            expect(httpService.fetchJson).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ signal: controller.signal })
            );
        });
    });

    describe('searchLocos', (): void => {
        it('searches using search_loco.php endpoint', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            await searchLocos('x');

            const url = vi.mocked(httpService.fetchJson).mock.calls[0][0];
            expect(url).toContain('search_loco.php?query=x');
        });

        it('passes AbortSignal through to searchEventGroups', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            const controller = new AbortController();
            await searchLocos('query', controller.signal);

            expect(httpService.fetchJson).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ signal: controller.signal })
            );
        });
    });

    describe('searchPlaces', (): void => {
        it('searches using search_place.php endpoint', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            await searchPlaces('Krakow');

            const url = vi.mocked(httpService.fetchJson).mock.calls[0][0];
            expect(url).toContain('search_place.php?query=Krakow');
        });

        it('passes AbortSignal through to searchEventGroups', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            const controller = new AbortController();
            await searchPlaces('query', controller.signal);

            expect(httpService.fetchJson).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ signal: controller.signal })
            );
        });
    });

    describe('searchDates', (): void => {
        it('searches using search_date.php endpoint', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            await searchDates('2025.01.02');

            const url = vi.mocked(httpService.fetchJson).mock.calls[0][0];
            expect(url).toContain('search_date.php?query=2025.01.02');
        });

        it('passes AbortSignal through to searchEventGroups', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValueOnce({});

            const controller = new AbortController();
            await searchDates('query', controller.signal);

            expect(httpService.fetchJson).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ signal: controller.signal })
            );
        });
    });

    describe('integration scenarios', (): void => {
        it('calls static endpoints for types and type details with same refresh timestamp', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValue({} as never);

            await loadTypes('123');
            await loadTypeById('byczki', '123');

            expect(httpService.fetchJson).toHaveBeenCalledTimes(2);
            const call1 = vi.mocked(httpService.fetchJson).mock.calls[0][0];
            const call2 = vi.mocked(httpService.fetchJson).mock.calls[1][0];

            expect(call1).toContain('types.json?refresh=123');
            expect(call2).toContain('type/byczki.json?refresh=123');
        });

        it('searches all event group types', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValue({} as never);

            await searchLocos('query1');
            await searchPlaces('query2');
            await searchDates('query3');

            expect(httpService.fetchJson).toHaveBeenCalledTimes(3);
            const calls = vi.mocked(httpService.fetchJson).mock.calls.map(call => call[0]);

            expect(calls[0]).toContain('search_loco.php?query=query1');
            expect(calls[1]).toContain('search_place.php?query=query2');
            expect(calls[2]).toContain('search_date.php?query=query3');
        });

        it('loads years/year/date static endpoints with refresh timestamp', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValue({} as never);

            await loadYears('123');
            await loadYear('2025', '123');
            await loadDatePage('2025.01.02', 1, '123');

            const calls = vi.mocked(httpService.fetchJson).mock.calls.map(call => call[0]);
            expect(calls[0]).toContain('years.json?refresh=123');
            expect(calls[1]).toContain('year/2025.json?refresh=123');
            expect(calls[2]).toContain('date/2025.01.02_page_1.json?refresh=123');
        });

        it('loads places/place static endpoints with refresh timestamp', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValue({} as never);

            await loadPlaces('123');
            await loadPlacePage('poznań_główny', 1, '123');

            const calls = vi.mocked(httpService.fetchJson).mock.calls.map(call => call[0]);
            expect(calls[0]).toContain('places.json?refresh=123');
            expect(calls[1]).toContain(
                'place/pozna%C5%84_g%C5%82%C3%B3wny_page_1.json?refresh=123'
            );
        });

        it('loads fav static endpoints with refresh timestamp', async (): Promise<void> => {
            vi.mocked(httpService.fetchJson).mockResolvedValue({} as never);

            await loadFavPage(0, '123');
            await loadFavPage(2, '123');

            const calls = vi.mocked(httpService.fetchJson).mock.calls.map(call => call[0]);
            expect(calls[0]).toContain('fav_events.json?refresh=123');
            expect(calls[1]).toContain('fav_events_page_2.json?refresh=123');
        });
    });
});
