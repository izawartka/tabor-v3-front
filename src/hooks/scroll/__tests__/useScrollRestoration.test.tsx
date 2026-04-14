import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import type { JSX } from 'react';
import { SCROLL_STORAGE_KEY, useScrollRestoration } from '../useScrollRestoration';

const mockUseLocation = vi.hoisted(() => vi.fn());
const mockUseNavigationType = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', () => ({
    useLocation: (): ReturnType<typeof mockUseLocation> => mockUseLocation(),
    useNavigationType: (): ReturnType<typeof mockUseNavigationType> => mockUseNavigationType()
}));

const Harness = (): JSX.Element | null => {
    useScrollRestoration();
    return null;
};

describe('useScrollRestoration', (): void => {
    beforeEach((): void => {
        vi.clearAllMocks();
        window.sessionStorage.clear();

        Object.defineProperty(window, 'scrollY', {
            value: 0,
            writable: true,
            configurable: true
        });

        Object.defineProperty(document.documentElement, 'scrollHeight', {
            value: 3000,
            writable: true,
            configurable: true
        });

        Object.defineProperty(document.body, 'scrollHeight', {
            value: 3000,
            writable: true,
            configurable: true
        });

        Object.defineProperty(window, 'innerHeight', {
            value: 1000,
            writable: true,
            configurable: true
        });

        window.requestAnimationFrame = vi.fn((cb: FrameRequestCallback): number => {
            cb(0);
            return 1;
        });
        window.cancelAnimationFrame = vi.fn();

        window.scrollTo = vi.fn((options?: ScrollToOptions | number): void => {
            if (typeof options === 'object' && options && typeof options.top === 'number') {
                Object.defineProperty(window, 'scrollY', {
                    value: options.top,
                    writable: true,
                    configurable: true
                });
            }
        }) as typeof window.scrollTo;

        mockUseLocation.mockReturnValue({
            pathname: '/types',
            search: '',
            hash: ''
        });
        mockUseNavigationType.mockReturnValue('PUSH');
    });

    it('resets scroll to top for non-POP navigation', (): void => {
        render(<Harness />);

        expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' });
    });

    it('restores saved position for POP navigation', (): void => {
        window.sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify({ '/types': 420 }));
        mockUseNavigationType.mockReturnValue('POP');

        render(<Harness />);

        expect(window.scrollTo).toHaveBeenCalledWith({ top: 420, left: 0, behavior: 'auto' });
    });

    it('does not restore when POP route has no saved position', (): void => {
        window.sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify({ '/years': 420 }));
        mockUseNavigationType.mockReturnValue('POP');

        render(<Harness />);

        expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it('handles invalid storage JSON without throwing during POP restore', (): void => {
        window.sessionStorage.setItem(SCROLL_STORAGE_KEY, '{broken-json');
        mockUseNavigationType.mockReturnValue('POP');

        expect((): void => {
            render(<Harness />);
        }).not.toThrow();
        expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it('caps restored scroll position to current max top', (): void => {
        Object.defineProperty(document.documentElement, 'scrollHeight', {
            value: 1500,
            writable: true,
            configurable: true
        });
        Object.defineProperty(document.body, 'scrollHeight', {
            value: 1500,
            writable: true,
            configurable: true
        });

        window.sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify({ '/types': 900 }));
        mockUseNavigationType.mockReturnValue('POP');

        let now = 0;
        vi.spyOn(Date, 'now').mockImplementation(() => {
            now += 5000;
            return now;
        });

        render(<Harness />);

        expect(window.scrollTo).toHaveBeenCalledWith({ top: 500, left: 0, behavior: 'auto' });
    });

    it('saves current route position after scroll event', (): void => {
        vi.spyOn(Date, 'now').mockImplementation(() => 1000);

        render(<Harness />);

        Object.defineProperty(window, 'scrollY', {
            value: 280,
            writable: true,
            configurable: true
        });

        fireEvent.scroll(window);

        const parsed = JSON.parse(
            window.sessionStorage.getItem(SCROLL_STORAGE_KEY) ?? '{}'
        ) as Record<string, number>;
        expect(parsed['/types']).toBe(280);
    });

    it('clears stored positions on beforeunload', (): void => {
        window.sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify({ '/types': 100 }));

        render(<Harness />);
        fireEvent(window, new Event('beforeunload'));

        expect(window.sessionStorage.getItem(SCROLL_STORAGE_KEY)).toBeNull();
    });

    it('captures anchor click and saves position immediately for current route', (): void => {
        render(<Harness />);

        Object.defineProperty(window, 'scrollY', {
            value: 333,
            writable: true,
            configurable: true
        });

        const anchor = document.createElement('a');
        anchor.href = '/years';
        document.body.append(anchor);

        fireEvent.click(anchor);

        const parsed = JSON.parse(
            window.sessionStorage.getItem(SCROLL_STORAGE_KEY) ?? '{}'
        ) as Record<string, number>;
        expect(parsed['/types']).toBe(333);
    });

    it('captures popstate and saves current route position', (): void => {
        render(<Harness />);

        Object.defineProperty(window, 'scrollY', {
            value: 210,
            writable: true,
            configurable: true
        });

        fireEvent.popState(window);

        const parsed = JSON.parse(
            window.sessionStorage.getItem(SCROLL_STORAGE_KEY) ?? '{}'
        ) as Record<string, number>;
        expect(parsed['/types']).toBe(210);
    });
});
