import { renderHook } from '@testing-library/react';
import type { JSX } from 'react';
import { ColorSchemeContext } from '../colorSchemeStore';
import { useColorScheme } from '../useColorScheme';

describe('useColorScheme', (): void => {
    it('throws outside provider', (): void => {
        expect((): void => {
            renderHook(() => useColorScheme());
        }).toThrow('useColorScheme must be used inside ColorSchemeProvider');
    });

    it('reads context value', (): void => {
        const wrapper = ({ children }: { children: React.ReactNode }): JSX.Element => (
            <ColorSchemeContext.Provider value={{ scheme: 'light', toggleScheme: vi.fn() }}>
                {children}
            </ColorSchemeContext.Provider>
        );

        const { result } = renderHook(() => useColorScheme(), { wrapper });

        expect(result.current.scheme).toBe('light');
    });
});
