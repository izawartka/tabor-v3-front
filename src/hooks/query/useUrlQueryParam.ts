import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

interface SetUrlQueryParamOptions {
    replace?: boolean;
    normalizeValue?: (value: string) => string;
}

export const useUrlQueryParam = (
    key: string
): readonly [string, (nextValue: string, options?: SetUrlQueryParamOptions) => void] => {
    const [searchParams, setSearchParams] = useSearchParams();

    const value = searchParams.get(key) ?? '';

    const setValue = useCallback(
        (nextValue: string, options?: SetUrlQueryParamOptions): void => {
            const normalizedValue = options?.normalizeValue?.(nextValue) ?? nextValue;

            setSearchParams(
                currentSearchParams => {
                    const nextSearchParams = new URLSearchParams(currentSearchParams);

                    if (normalizedValue.length === 0) {
                        nextSearchParams.delete(key);
                    } else {
                        nextSearchParams.set(key, normalizedValue);
                    }

                    return nextSearchParams;
                },
                { replace: options?.replace ?? true }
            );
        },
        [key, setSearchParams]
    );

    return [value, setValue] as const;
};
