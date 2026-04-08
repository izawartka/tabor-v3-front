import { render } from '@testing-library/react';
import type { JSX } from 'react';
import { INFINITE_SCROLL_ROOT_MARGIN, useInfiniteScroll } from '../useInfiniteScroll';

describe('useInfiniteScroll', (): void => {
    it('exports default root margin', (): void => {
        expect(INFINITE_SCROLL_ROOT_MARGIN).toBe('500px');
    });

    it('observes anchor and triggers load callback on intersection', (): void => {
        const observe = vi.fn();
        const disconnect = vi.fn();
        let callback: IntersectionObserverCallback = (): void => undefined;

        class IntersectionObserverMock {
            public constructor(cb: IntersectionObserverCallback) {
                callback = cb;
            }

            public observe = observe;
            public disconnect = disconnect;
        }

        vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

        const onLoadMore = vi.fn();

        const Harness = ({ enabled }: { enabled: boolean }): JSX.Element => {
            const anchorRef = useInfiniteScroll({
                enabled,
                hasMore: true,
                isLoading: false,
                onLoadMore
            });

            return <div ref={anchorRef} />;
        };

        const { rerender, unmount } = render(<Harness enabled={false} />);
        expect(observe).not.toHaveBeenCalled();

        rerender(<Harness enabled />);
        expect(observe).toHaveBeenCalledTimes(1);

        callback(
            [{ isIntersecting: true } as IntersectionObserverEntry],
            {} as IntersectionObserver
        );
        expect(onLoadMore).toHaveBeenCalledTimes(1);

        unmount();
        expect(disconnect).toHaveBeenCalledTimes(1);
    });
});
