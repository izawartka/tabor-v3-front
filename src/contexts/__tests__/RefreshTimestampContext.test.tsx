import { act, render, screen } from '@testing-library/react';
import type { JSX } from 'react';
import type { Mock } from 'vitest';
import { RefreshTimestampProvider } from '../RefreshTimestampContext';
import { useRefreshTimestamp } from '../useRefreshTimestamp';
import * as apiService from '../../services/apiService';
import { ApiError } from '../../services/httpService';
import { REFRESH_TIMESTAMP_ERROR_MESSAGE } from '../RefreshTimestampContext';

const REFRESH_TIMESTAMP_CONTEXT_LOADING_TEXT = 'loading';
const REFRESH_TIMESTAMP_CONTEXT_LOADED_TEXT = 'loaded';
const REFRESH_TIMESTAMP_CONTEXT_OK_TEXT = 'ok';
const REFRESH_TIMESTAMP_CONTEXT_VALUE = '123';
const REFRESH_TIMESTAMP_CONTEXT_EMPTY_VALUE = '-';

vi.mock('../../services/apiService', async (): Promise<{ loadRefreshTimestamp: Mock }> => {
    const actual = await vi.importActual('../../services/apiService');
    return {
        ...actual,
        loadRefreshTimestamp: vi.fn()
    };
});

const Probe = (): JSX.Element => {
    const { refreshTimestamp, isLoading, error } = useRefreshTimestamp();

    return (
        <div>
            <span>
                {isLoading
                    ? REFRESH_TIMESTAMP_CONTEXT_LOADING_TEXT
                    : REFRESH_TIMESTAMP_CONTEXT_LOADED_TEXT}
            </span>
            <span>{error ?? REFRESH_TIMESTAMP_CONTEXT_OK_TEXT}</span>
            <span>{refreshTimestamp ?? REFRESH_TIMESTAMP_CONTEXT_EMPTY_VALUE}</span>
        </div>
    );
};

describe('RefreshTimestampContext', (): void => {
    beforeEach((): void => {
        vi.clearAllMocks();
    });

    it('loads timestamp once', async (): Promise<void> => {
        vi.mocked(apiService.loadRefreshTimestamp).mockResolvedValueOnce(
            REFRESH_TIMESTAMP_CONTEXT_VALUE
        );

        await act(async (): Promise<void> => {
            render(
                <RefreshTimestampProvider>
                    <Probe />
                </RefreshTimestampProvider>
            );
        });

        expect(screen.getByText(REFRESH_TIMESTAMP_CONTEXT_LOADED_TEXT)).toBeInTheDocument();
        expect(screen.getByText(REFRESH_TIMESTAMP_CONTEXT_VALUE)).toBeInTheDocument();
        expect(screen.getByText(REFRESH_TIMESTAMP_CONTEXT_OK_TEXT)).toBeInTheDocument();
    });

    it('exposes ApiError message when request fails with ApiError', async (): Promise<void> => {
        vi.mocked(apiService.loadRefreshTimestamp).mockRejectedValueOnce(
            new ApiError('Błąd testowy', 500)
        );

        await act(async (): Promise<void> => {
            render(
                <RefreshTimestampProvider>
                    <Probe />
                </RefreshTimestampProvider>
            );
        });

        expect(screen.getByText(REFRESH_TIMESTAMP_CONTEXT_LOADED_TEXT)).toBeInTheDocument();
        expect(screen.getByText('Błąd testowy')).toBeInTheDocument();
        expect(screen.getByText(REFRESH_TIMESTAMP_CONTEXT_EMPTY_VALUE)).toBeInTheDocument();
    });

    it('exposes fallback message when request fails with unknown error', async (): Promise<void> => {
        vi.mocked(apiService.loadRefreshTimestamp).mockRejectedValueOnce(new Error('unknown'));

        await act(async (): Promise<void> => {
            render(
                <RefreshTimestampProvider>
                    <Probe />
                </RefreshTimestampProvider>
            );
        });

        expect(screen.getByText(REFRESH_TIMESTAMP_CONTEXT_LOADED_TEXT)).toBeInTheDocument();
        expect(screen.getByText(REFRESH_TIMESTAMP_ERROR_MESSAGE)).toBeInTheDocument();
    });

    it('retries load after failure and resolves with fresh timestamp', async (): Promise<void> => {
        vi.mocked(apiService.loadRefreshTimestamp)
            .mockRejectedValueOnce(new ApiError('chwilowy błąd'))
            .mockResolvedValueOnce('456');

        const RetryProbe = (): JSX.Element => {
            const { refreshTimestamp, isLoading, error, retry } = useRefreshTimestamp();

            return (
                <div>
                    <span>{isLoading ? REFRESH_TIMESTAMP_CONTEXT_LOADING_TEXT : 'idle'}</span>
                    <span>{error ?? REFRESH_TIMESTAMP_CONTEXT_OK_TEXT}</span>
                    <span>{refreshTimestamp ?? REFRESH_TIMESTAMP_CONTEXT_EMPTY_VALUE}</span>
                    <button onClick={retry}>retry</button>
                </div>
            );
        };

        await act(async (): Promise<void> => {
            render(
                <RefreshTimestampProvider>
                    <RetryProbe />
                </RefreshTimestampProvider>
            );
        });

        expect(screen.getByText('chwilowy błąd')).toBeInTheDocument();

        await act(async (): Promise<void> => {
            screen.getByRole('button', { name: 'retry' }).click();
        });

        expect(vi.mocked(apiService.loadRefreshTimestamp)).toHaveBeenCalledTimes(2);
        expect(screen.getByText(REFRESH_TIMESTAMP_CONTEXT_OK_TEXT)).toBeInTheDocument();
        expect(screen.getByText('456')).toBeInTheDocument();
    });
});
