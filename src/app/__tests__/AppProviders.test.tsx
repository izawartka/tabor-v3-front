import { render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { AppProviders } from '../AppProviders';

vi.mock('../../contexts/useColorScheme', () => ({
    useColorScheme: vi.fn(() => ({ scheme: 'dark', toggleScheme: vi.fn() }))
}));

vi.mock('../../contexts/RefreshTimestampContext', () => ({
    RefreshTimestampProvider: ({ children }: { children: React.ReactNode }): ReactElement => (
        <>{children}</>
    )
}));

describe('AppProviders', (): void => {
    it('renders children inside provider tree', (): void => {
        render(
            <AppProviders>
                <div>child</div>
            </AppProviders>
        );

        expect(screen.getByText('child')).toBeInTheDocument();
    });
});
