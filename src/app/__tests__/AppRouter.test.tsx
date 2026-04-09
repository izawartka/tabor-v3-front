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
vi.mock('../../pages/PlacesPage', () => ({
    PlacesPage: (): ReactElement => <div>places-page</div>
}));
vi.mock('../../pages/PlacePage', () => ({
    PlacePage: (): ReactElement => <div>place-page</div>
}));
vi.mock('../../pages/YearsPage', () => ({
    YearsPage: (): ReactElement => <div>years-page</div>
}));
vi.mock('../../pages/YearPage', () => ({
    YearPage: (): ReactElement => <div>year-page</div>
}));
vi.mock('../../pages/DatePage', () => ({
    DatePage: (): ReactElement => <div>date-page</div>
}));
vi.mock('../../pages/PlaceholderPage', () => ({
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

        cleanup();

        render(
            <MemoryRouter initialEntries={['/places']}>
                <AppRouter />
            </MemoryRouter>
        );
        expect(screen.getByText('places-page')).toBeInTheDocument();

        cleanup();

        render(
            <MemoryRouter initialEntries={['/place/poznań_główny']}>
                <AppRouter />
            </MemoryRouter>
        );
        expect(screen.getByText('place-page')).toBeInTheDocument();

        cleanup();

        render(
            <MemoryRouter initialEntries={['/years']}>
                <AppRouter />
            </MemoryRouter>
        );
        expect(screen.getByText('years-page')).toBeInTheDocument();

        cleanup();

        render(
            <MemoryRouter initialEntries={['/year/2025']}>
                <AppRouter />
            </MemoryRouter>
        );
        expect(screen.getByText('year-page')).toBeInTheDocument();

        cleanup();

        render(
            <MemoryRouter initialEntries={['/date/2025.01.02']}>
                <AppRouter />
            </MemoryRouter>
        );
        expect(screen.getByText('date-page')).toBeInTheDocument();
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
