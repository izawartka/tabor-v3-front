import { fetchJson } from './httpService';

const jsonCache = new Map<string, unknown>();
const jsonInFlight = new Map<string, Promise<unknown>>();

const ABORT_ERROR_NAME = 'AbortError';

const createAbortError = (): Error => {
    if (typeof DOMException !== 'undefined') {
        return new DOMException('Aborted', ABORT_ERROR_NAME);
    }

    const error = new Error('Aborted');
    error.name = ABORT_ERROR_NAME;
    return error;
};

const withAbortSignal = async <T>(promise: Promise<T>, signal?: AbortSignal): Promise<T> => {
    if (!signal) {
        return promise;
    }

    if (signal.aborted) {
        throw createAbortError();
    }

    return new Promise<T>((resolve, reject) => {
        const onAbort = (): void => {
            signal.removeEventListener('abort', onAbort);
            reject(createAbortError());
        };

        signal.addEventListener('abort', onAbort, { once: true });

        promise.then(
            value => {
                signal.removeEventListener('abort', onAbort);
                resolve(value);
            },
            error => {
                signal.removeEventListener('abort', onAbort);
                reject(error);
            }
        );
    });
};

export const loadCachedJson = async <T>(url: string, signal?: AbortSignal): Promise<T> => {
    if (jsonCache.has(url)) {
        return jsonCache.get(url) as T;
    }

    const inFlight = jsonInFlight.get(url) as Promise<T> | undefined;
    if (inFlight) {
        return withAbortSignal(inFlight, signal);
    }

    if (signal) {
        const value = await fetchJson<T>(url, { signal });
        jsonCache.set(url, value);
        return value;
    }

    const request = Promise.resolve(fetchJson<T>(url, { signal: undefined }))
        .then(value => {
            jsonCache.set(url, value);
            return value;
        })
        .finally(() => {
            jsonInFlight.delete(url);
        });

    jsonInFlight.set(url, request as Promise<unknown>);

    return request;
};

export const clearCache = (): void => {
    jsonCache.clear();
    jsonInFlight.clear();
};
