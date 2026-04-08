import {
    HTTP_DEFAULT_INIT,
    HTTP_ERROR_GENERIC_MESSAGE,
    HTTP_ERROR_INVALID_RESPONSE_MESSAGE,
    HTTP_ERROR_NOT_FOUND_MESSAGE,
    HTTP_ERROR_SERVER_MESSAGE,
    ApiError,
    fetchJson,
    fetchText
} from '../httpService';

describe('httpService', (): void => {
    beforeEach((): void => {
        vi.restoreAllMocks();
    });

    describe('ApiError', (): void => {
        it('creates error with message and optional status', (): void => {
            const error1 = new ApiError('Test error');
            expect(error1.message).toBe('Test error');
            expect(error1.status).toBeUndefined();
            expect(error1.name).toBe('ApiError');

            const error2 = new ApiError('Test error', 404);
            expect(error2.message).toBe('Test error');
            expect(error2.status).toBe(404);
        });

        it('is an instance of Error', (): void => {
            const error = new ApiError('test');
            expect(error instanceof Error).toBe(true);
        });
    });

    describe('constants', (): void => {
        it('exports stable error messages', (): void => {
            expect(HTTP_ERROR_SERVER_MESSAGE).toBe('Błąd serwera. Spróbuj ponownie później.');
            expect(HTTP_ERROR_NOT_FOUND_MESSAGE).toBe('Nie znaleziono zasobu.');
            expect(HTTP_ERROR_GENERIC_MESSAGE).toBe('Nie udało się pobrać danych.');
            expect(HTTP_ERROR_INVALID_RESPONSE_MESSAGE).toBe('Nieprawidłowa odpowiedź serwera.');
        });

        it('exports default init with GET method', (): void => {
            expect(HTTP_DEFAULT_INIT).toEqual({ method: 'GET' });
        });
    });

    describe('fetchText', (): void => {
        it('returns text from successful response', async (): Promise<void> => {
            vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
                ok: true,
                text: async () => 'success'
            } as Response);

            const result = await fetchText('/test-url');

            expect(result).toBe('success');
            expect(fetch).toHaveBeenCalledWith('/test-url', { method: 'GET' });
        });

        it('merges init overrides with defaults', async (): Promise<void> => {
            vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
                ok: true,
                text: async () => 'text'
            } as Response);

            await fetchText('/url', { cache: 'no-store' });

            expect(fetch).toHaveBeenCalledWith('/url', { method: 'GET', cache: 'no-store' });
        });

        it('throws ApiError with server message on 500', async (): Promise<void> => {
            vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
                ok: false,
                status: 500
            } as Response);

            await expect(fetchText('/x')).rejects.toEqual(
                expect.objectContaining({
                    message: HTTP_ERROR_SERVER_MESSAGE,
                    status: 500
                })
            );
        });

        it('throws ApiError with not found message on 404', async (): Promise<void> => {
            vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
                ok: false,
                status: 404
            } as Response);

            await expect(fetchText('/x')).rejects.toEqual(
                expect.objectContaining({
                    message: HTTP_ERROR_NOT_FOUND_MESSAGE,
                    status: 404
                })
            );
        });

        it('throws ApiError with generic message on other 4xx', async (): Promise<void> => {
            vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
                ok: false,
                status: 400
            } as Response);

            await expect(fetchText('/x')).rejects.toEqual(
                expect.objectContaining({
                    message: HTTP_ERROR_GENERIC_MESSAGE,
                    status: 400
                })
            );
        });

        it('maps all 5xx status codes to server error message', async (): Promise<void> => {
            for (const status of [500, 501, 502, 503, 504]) {
                vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
                    ok: false,
                    status
                } as Response);

                const error = await fetchText('/x').catch(e => e);
                expect(error.message).toBe(HTTP_ERROR_SERVER_MESSAGE);
                expect(error.status).toBe(status);
            }
        });

        it('handles fetch network errors', async (): Promise<void> => {
            vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new TypeError('Network error'));

            await expect(fetchText('/x')).rejects.toThrow('Network error');
        });

        it('handles signal abort', async (): Promise<void> => {
            const controller = new AbortController();
            vi.spyOn(globalThis, 'fetch').mockImplementationOnce(async (_, init) => {
                if ((init as RequestInit).signal?.aborted) {
                    throw new DOMException('Aborted', 'AbortError');
                }
                return { ok: true, text: async () => 'test' } as Response;
            });

            controller.abort();
            await expect(fetchText('/x', { signal: controller.signal })).rejects.toThrow('Aborted');
        });
    });

    describe('fetchJson', (): void => {
        it('returns parsed JSON from successful response', async (): Promise<void> => {
            const testData = { value: 1, name: 'test' };
            vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
                ok: true,
                json: async () => testData
            } as Response);

            const result = await fetchJson<typeof testData>('/test-url');

            expect(result).toEqual(testData);
            expect(fetch).toHaveBeenCalledWith('/test-url', { method: 'GET' });
        });

        it('merges init overrides with defaults', async (): Promise<void> => {
            vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
                ok: true,
                json: async () => ({})
            } as Response);

            await fetchJson('/url', { cache: 'no-store' });

            expect(fetch).toHaveBeenCalledWith('/url', { method: 'GET', cache: 'no-store' });
        });

        it('throws ApiError with server message on 500', async (): Promise<void> => {
            vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
                ok: false,
                status: 500
            } as Response);

            await expect(fetchJson('/x')).rejects.toEqual(
                expect.objectContaining({
                    message: HTTP_ERROR_SERVER_MESSAGE,
                    status: 500
                })
            );
        });

        it('throws ApiError with not found message on 404', async (): Promise<void> => {
            vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
                ok: false,
                status: 404
            } as Response);

            await expect(fetchJson('/x')).rejects.toEqual(
                expect.objectContaining({
                    message: HTTP_ERROR_NOT_FOUND_MESSAGE,
                    status: 404
                })
            );
        });

        it('throws ApiError with invalid response message for non-JSON', async (): Promise<void> => {
            vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
                ok: true,
                json: async () => {
                    throw new SyntaxError('Unexpected token');
                }
            } as unknown as Response);

            await expect(fetchJson('/x')).rejects.toEqual(
                expect.objectContaining({
                    message: HTTP_ERROR_INVALID_RESPONSE_MESSAGE,
                    status: undefined
                })
            );
        });

        it('throws ApiError for various JSON parsing errors', async (): Promise<void> => {
            const errors = [
                new SyntaxError('Unexpected token'),
                new TypeError('JSON parsing error'),
                new Error('Generic error during JSON parse')
            ];

            for (const error of errors) {
                vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
                    ok: true,
                    json: async () => {
                        throw error;
                    }
                } as unknown as Response);

                await expect(fetchJson('/x')).rejects.toEqual(
                    expect.objectContaining({
                        message: HTTP_ERROR_INVALID_RESPONSE_MESSAGE
                    })
                );
            }
        });

        it('handles empty JSON response', async (): Promise<void> => {
            vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
                ok: true,
                json: async () => ({})
            } as Response);

            const result = await fetchJson<Record<string, never>>('/x');
            expect(result).toEqual({});
        });

        it('handles array JSON response', async (): Promise<void> => {
            const arrayData = [1, 2, 3];
            vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
                ok: true,
                json: async () => arrayData
            } as Response);

            const result = await fetchJson<typeof arrayData>('/x');
            expect(result).toEqual(arrayData);
        });

        it('handles null JSON response', async (): Promise<void> => {
            vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
                ok: true,
                json: async () => null
            } as Response);

            const result = await fetchJson<null>('/x');
            expect(result).toBeNull();
        });

        it('handles signal abort', async (): Promise<void> => {
            const controller = new AbortController();
            vi.spyOn(globalThis, 'fetch').mockImplementationOnce(async (_, init) => {
                if ((init as RequestInit).signal?.aborted) {
                    throw new DOMException('Aborted', 'AbortError');
                }
                return { ok: true, json: async () => ({}) } as Response;
            });

            controller.abort();
            await expect(fetchJson('/x', { signal: controller.signal })).rejects.toThrow('Aborted');
        });
    });
});
