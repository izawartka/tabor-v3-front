import type { ReactElement } from 'react';
import { ScrollRestorationGate } from '../ScrollRestorationGate';
import { renderWithTheme } from '../../test/renderWithTheme';

const mockUseScrollRestoration = vi.hoisted(() => vi.fn());

vi.mock('../../hooks/scroll/useScrollRestoration', () => ({
    useScrollRestoration: (): ReturnType<typeof mockUseScrollRestoration> =>
        mockUseScrollRestoration()
}));

describe('ScrollRestorationGate', (): void => {
    beforeEach((): void => {
        vi.clearAllMocks();
    });

    it('calls restoration hook and renders nothing', (): void => {
        const { container } = renderWithTheme((<ScrollRestorationGate />) as ReactElement);

        expect(mockUseScrollRestoration).toHaveBeenCalledTimes(1);
        expect(container).toBeEmptyDOMElement();
    });
});
