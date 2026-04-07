export class ApiError extends Error {
    public readonly status?: number;

    public constructor(message: string, status?: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

export const HTTP_ERROR_SERVER_MESSAGE = 'Błąd serwera. Spróbuj ponownie później.';
export const HTTP_ERROR_NOT_FOUND_MESSAGE = 'Nie znaleziono zasobu.';
export const HTTP_ERROR_GENERIC_MESSAGE = 'Nie udało się pobrać danych.';
export const HTTP_ERROR_INVALID_RESPONSE_MESSAGE = 'Nieprawidłowa odpowiedź serwera.';
export const HTTP_DEFAULT_INIT: RequestInit = {
    method: 'GET'
};

const toMessage = (status: number): string => {
    if (status >= 500) {
        return HTTP_ERROR_SERVER_MESSAGE;
    }

    if (status === 404) {
        return HTTP_ERROR_NOT_FOUND_MESSAGE;
    }

    return HTTP_ERROR_GENERIC_MESSAGE;
};

export const fetchText = async (url: string, initOverride?: RequestInit): Promise<string> => {
    const response = await fetch(url, { ...HTTP_DEFAULT_INIT, ...initOverride });

    if (!response.ok) {
        throw new ApiError(toMessage(response.status), response.status);
    }

    return response.text();
};

export const fetchJson = async <T>(url: string, initOverride?: RequestInit): Promise<T> => {
    const response = await fetch(url, { ...HTTP_DEFAULT_INIT, ...initOverride });

    if (!response.ok) {
        throw new ApiError(toMessage(response.status), response.status);
    }

    try {
        return (await response.json()) as T;
    } catch {
        throw new ApiError(HTTP_ERROR_INVALID_RESPONSE_MESSAGE);
    }
};
