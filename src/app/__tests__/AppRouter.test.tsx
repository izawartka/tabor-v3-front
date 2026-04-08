import { cleanup, render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AppRouter } from '../AppRouter';

vi.mock('../../components/PageLayout/PageLayout', () => ({
    PageLayout: ({ children }: { children: React.ReactNode }): ReactElement => <div>{children}</div>
}));

vi.mock('../RefreshTimestampGate', () => ({
    RefreshTimestampGate: ({ children }: { children: React.ReactNode }): ReactElement => (
        <>{children}</>
    )
}));

vi.mock('../../pages/TypesPage', () => ({
    TypesPage: (): ReactElement => <div>types-page</div>
}));
vi.mock('../../pages/TypePage', () => ({
    TypePage: (): ReactElement => <div>type-page</div>
}));
vi.mock('../../pages/LocoPage', () => ({
    LocoPage: (): ReactElement => <div>loco-page</div>
}));
vi.mock('../../pages/PlaceholderPage', () => ({
    PlaceholderEventGroupsPage: (): ReactElement => <div>placeholder-groups</div>,
    PlaceholderEventListPage: (): ReactElement => <div>placeholder-list</div>
}));
vi.mock('../../pages/NotFoundPage', () => ({
    NotFoundPage: (): ReactElement => <div>not-found</div>
}));

describe('AppRouter', (): void => {
    it('renders typed route targets', (): void => {
        render(
            <MemoryRouter initialEntries={['/types']}>
                <AppRouter />
            </MemoryRouter>
        );
        expect(screen.getByText('types-page')).toBeInTheDocument();

        cleanup();

        render(
            <MemoryRouter initialEntries={['/type/siodemki']}>
                <AppRouter />
            </MemoryRouter>
        );
        expect(screen.getByText('type-page')).toBeInTheDocument();

        cleanup();

        render(
            <MemoryRouter initialEntries={['/loco/d6a9d19a']}>
                <AppRouter />
            </MemoryRouter>
        );
        expect(screen.getByText('loco-page')).toBeInTheDocument();
    });

    it('redirects unknown paths to not-found', (): void => {
        render(
            <MemoryRouter initialEntries={['/unknown']}>
                <AppRouter />
            </MemoryRouter>
        );

        expect(screen.getByText('not-found')).toBeInTheDocument();
    });
});
