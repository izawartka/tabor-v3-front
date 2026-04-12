import { clearCache, loadCachedJson } from '../cacheService';
import * as httpService from '../httpService';

vi.mock('../httpService', () => ({
    fetchJson: vi.fn()
}));

describe('cacheService', (): void => {
    beforeEach((): void => {
        vi.clearAllMocks();
        clearCache();
    });

    it('returns cached response for repeated URL requests', async (): Promise<void> => {
        vi.mocked(httpService.fetchJson).mockResolvedValueOnce({ value: 1 } as never);

        const first = await loadCachedJson<{ value: number }>('https://example.com/data.json');
        const second = await loadCachedJson<{ value: number }>('https://example.com/data.json');

        expect(first).toEqual({ value: 1 });
        expect(second).toEqual({ value: 1 });
        expect(httpService.fetchJson).toHaveBeenCalledTimes(1);
    });

    it('shares in-flight request for non-abortable consumers', async (): Promise<void> => {
        let resolveFetch!: (value: unknown) => void;
        const fetchPromise = new Promise<unknown>(resolve => {
            resolveFetch = resolve;
        });

        vi.mocked(httpService.fetchJson).mockReturnValue(fetchPromise as never);

        const firstPromise = loadCachedJson<{ value: number }>('https://example.com/shared.json');
        const secondPromise = loadCachedJson<{ value: number }>('https://example.com/shared.json');

        resolveFetch({ value: 7 });

        await expect(firstPromise).resolves.toEqual({ value: 7 });
        await expect(secondPromise).resolves.toEqual({ value: 7 });
        expect(httpService.fetchJson).toHaveBeenCalledTimes(1);
    });

    it('supports aborting consumer attached to in-flight request', async (): Promise<void> => {
        let resolveFetch!: (value: unknown) => void;
        const fetchPromise = new Promise<unknown>(resolve => {
            resolveFetch = resolve;
        });

        vi.mocked(httpService.fetchJson).mockReturnValue(fetchPromise as never);

        void loadCachedJson('https://example.com/abortable.json');

        const controller = new AbortController();
        const abortableConsumer = loadCachedJson(
            'https://example.com/abortable.json',
            controller.signal
        );

        controller.abort();

        await expect(abortableConsumer).rejects.toMatchObject({ name: 'AbortError' });

        resolveFetch({ ok: true });
        await expect(loadCachedJson('https://example.com/abortable.json')).resolves.toEqual({
            ok: true
        });
        expect(httpService.fetchJson).toHaveBeenCalledTimes(1);
    });

    it('passes signal on first request and reuses cache afterwards', async (): Promise<void> => {
        vi.mocked(httpService.fetchJson).mockResolvedValue({ ok: true } as never);

        const firstController = new AbortController();
        const secondController = new AbortController();

        const first = await loadCachedJson(
            'https://example.com/signal.json',
            firstController.signal
        );
        const second = await loadCachedJson(
            'https://example.com/signal.json',
            secondController.signal
        );

        expect(first).toEqual({ ok: true });
        expect(second).toEqual({ ok: true });
        expect(httpService.fetchJson).toHaveBeenCalledTimes(1);
        expect(httpService.fetchJson).toHaveBeenCalledWith(
            'https://example.com/signal.json',
            expect.objectContaining({ signal: firstController.signal })
        );
    });

    it('clearCache clears cached values and forces refetch', async (): Promise<void> => {
        vi.mocked(httpService.fetchJson)
            .mockResolvedValueOnce({ value: 1 } as never)
            .mockResolvedValueOnce({ value: 2 } as never);

        await loadCachedJson('https://example.com/clear.json');
        clearCache();
        const second = await loadCachedJson<{ value: number }>('https://example.com/clear.json');

        expect(second).toEqual({ value: 2 });
        expect(httpService.fetchJson).toHaveBeenCalledTimes(2);
    });
});
