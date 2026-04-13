import { renderHook, waitFor } from '@testing-library/react';
import { useMediaQuery } from '../useMediaQuery';

describe('useMediaQuery', (): void => {
    beforeEach((): void => {
        vi.clearAllMocks();
    });

    it('returns false when query does not match', (): void => {
        vi.spyOn(window, 'matchMedia').mockImplementation(() => ({
            matches: false,
            media: '',
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn()
        }));

        const { result } = renderHook(() => useMediaQuery('(max-width: 600px)'));

        expect(result.current).toBe(false);
    });

    it('returns true when query matches', (): void => {
        vi.spyOn(window, 'matchMedia').mockImplementation(() => ({
            matches: true,
            media: '',
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn()
        }));

        const { result } = renderHook(() => useMediaQuery('(max-width: 600px)'));

        expect(result.current).toBe(true);
    });

    it('updates state when media query changes', async (): Promise<void> => {
        const listeners: ((e: MediaQueryListEvent) => void)[] = [];

        const mockMediaQueryList = {
            matches: false,
            media: '',
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn((event: string, listener: (e: MediaQueryListEvent) => void) => {
                if (event === 'change') {
                    listeners.push(listener);
                }
            }),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn()
        };

        vi.spyOn(window, 'matchMedia').mockImplementation(
            () => mockMediaQueryList as unknown as MediaQueryList
        );

        const { result, rerender } = renderHook(({ query }) => useMediaQuery(query), {
            initialProps: { query: '(max-width: 600px)' }
        });

        expect(result.current).toBe(false);

        (mockMediaQueryList as { matches: boolean }).matches = true;
        listeners[0]?.({} as MediaQueryListEvent);

        await waitFor(() => {
            rerender({ query: '(max-width: 600px)' });
        });

        expect(result.current).toBe(true);
    });

    it('adds and removes event listener on mount/unmount', (): void => {
        const addEventListenerMock = vi.fn();
        const removeEventListenerMock = vi.fn();

        vi.spyOn(window, 'matchMedia').mockImplementation(() => ({
            matches: false,
            media: '',
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: addEventListenerMock,
            removeEventListener: removeEventListenerMock,
            dispatchEvent: vi.fn()
        }));

        const { unmount } = renderHook(() => useMediaQuery('(max-width: 600px)'));

        expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));

        unmount();

        expect(removeEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('handles different queries correctly', (): void => {
        const queries = [
            { query: '(max-width: 600px)', matches: true },
            { query: '(max-width: 1024px)', matches: false },
            { query: '(prefers-color-scheme: dark)', matches: true }
        ];

        queries.forEach(({ query, matches }) => {
            vi.spyOn(window, 'matchMedia').mockImplementation(() => ({
                matches,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn()
            }));

            const { result } = renderHook(() => useMediaQuery(query));

            expect(result.current).toBe(matches);

            vi.restoreAllMocks();
        });
    });

    it('returns false when matchMedia is not supported', (): void => {
        const originalMatchMedia = window.matchMedia;
        // @ts-expect-error intentional for testing
        delete window.matchMedia;

        const { result } = renderHook(() => useMediaQuery('(max-width: 600px)'));

        expect(result.current).toBe(false);

        window.matchMedia = originalMatchMedia;
    });

    it('updates query dependency correctly', (): void => {
        const addEventListenerMock = vi.fn();
        const removeEventListenerMock = vi.fn();

        vi.spyOn(window, 'matchMedia').mockImplementation(() => ({
            matches: false,
            media: '',
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: addEventListenerMock,
            removeEventListener: removeEventListenerMock,
            dispatchEvent: vi.fn()
        }));

        const { rerender } = renderHook(({ query }) => useMediaQuery(query), {
            initialProps: { query: '(max-width: 600px)' }
        });

        const initialCallCount = addEventListenerMock.mock.calls.length;

        rerender({ query: '(max-width: 1024px)' });

        expect(addEventListenerMock.mock.calls.length).toBeGreaterThan(initialCallCount);
    });
});
