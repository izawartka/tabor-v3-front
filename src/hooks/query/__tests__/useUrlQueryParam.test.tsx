import { act, renderHook } from '@testing-library/react';
import type { JSX } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { useUrlQueryParam } from '../useUrlQueryParam';

const wrapper = ({ children }: { children: React.ReactNode }): JSX.Element => (
    <MemoryRouter initialEntries={['/types?q=start']}>{children}</MemoryRouter>
);

describe('useUrlQueryParam', (): void => {
    it('reads initial value and updates it', (): void => {
        const { result } = renderHook(() => useUrlQueryParam('q'), { wrapper });

        expect(result.current[0]).toBe('start');

        act((): void => {
            result.current[1]('next');
        });

        expect(result.current[0]).toBe('next');
    });

    it('deletes query param when normalized value is empty', (): void => {
        const { result } = renderHook(() => useUrlQueryParam('q'), { wrapper });

        act((): void => {
            result.current[1]('   ', { normalizeValue: value => value.trim() });
        });

        expect(result.current[0]).toBe('');
    });
});
