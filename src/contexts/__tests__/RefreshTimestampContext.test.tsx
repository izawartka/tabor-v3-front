import { act, render, screen } from '@testing-library/react';
import type { JSX } from 'react';
import type { Mock } from 'vitest';
import { RefreshTimestampProvider } from '../RefreshTimestampContext';
import { useRefreshTimestamp } from '../useRefreshTimestamp';
import * as apiService from '../../services/apiService';

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
});
