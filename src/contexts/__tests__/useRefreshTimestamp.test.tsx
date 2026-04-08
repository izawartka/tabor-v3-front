import { renderHook } from '@testing-library/react';
import type { JSX } from 'react';
import { RefreshTimestampContext } from '../refreshTimestampStore';
import { useRefreshTimestamp } from '../useRefreshTimestamp';

describe('useRefreshTimestamp', (): void => {
    it('throws outside provider', (): void => {
        expect((): void => {
            renderHook(() => useRefreshTimestamp());
        }).toThrow('useRefreshTimestamp must be used inside RefreshTimestampProvider');
    });

    it('reads context value', (): void => {
        const retry = vi.fn();
        const wrapper = ({ children }: { children: React.ReactNode }): JSX.Element => (
            <RefreshTimestampContext.Provider
                value={{ refreshTimestamp: '123', isLoading: false, error: null, retry }}
            >
                {children}
            </RefreshTimestampContext.Provider>
        );

        const { result } = renderHook(() => useRefreshTimestamp(), { wrapper });

        expect(result.current.refreshTimestamp).toBe('123');
        expect(result.current.retry).toBe(retry);
    });
});
