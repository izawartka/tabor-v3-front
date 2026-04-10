import { renderHook } from '@testing-library/react';
import type { JSX } from 'react';
import { PrivateModeContext } from '../privateModeStore';
import { usePrivateMode } from '../usePrivateMode';

describe('usePrivateMode', (): void => {
    it('throws outside provider', (): void => {
        expect((): void => {
            renderHook(() => usePrivateMode());
        }).toThrow('usePrivateMode must be used inside PrivateModeProvider');
    });

    it('reads context value', (): void => {
        const wrapper = ({ children }: { children: React.ReactNode }): JSX.Element => (
            <PrivateModeContext.Provider value={{ privateMode: true, togglePrivateMode: vi.fn() }}>
                {children}
            </PrivateModeContext.Provider>
        );

        const { result } = renderHook(() => usePrivateMode(), { wrapper });

        expect(result.current.privateMode).toBe(true);
    });
});
