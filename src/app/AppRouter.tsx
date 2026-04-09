import { Navigate, Route, Routes } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout/PageLayout';
import { RefreshTimestampGate } from './RefreshTimestampGate';
import { LocoPage } from '../pages/LocoPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { TypePage } from '../pages/TypePage';
import { TypesPage } from '../pages/TypesPage';
import { YearsPage } from '../pages/YearsPage';
import { YearPage } from '../pages/YearPage';
import { DatePage } from '../pages/DatePage';
import type { JSX } from 'react';
import { PlacesPage } from '../pages/PlacesPage';
import { PlacePage } from '../pages/PlacePage';
import { FavPage } from '../pages/FavPage';

export const AppRouter = (): JSX.Element => (
    <PageLayout>
        <RefreshTimestampGate>
            <Routes>
                <Route path="/" element={<TypesPage />} />
                <Route path="/types" element={<TypesPage />} />
                <Route path="/type/:id" element={<TypePage />} />
                <Route path="/loco/:id" element={<LocoPage />} />

                <Route path="/places" element={<PlacesPage />} />
                <Route path="/place/:id" element={<PlacePage />} />

                <Route path="/years" element={<YearsPage />} />
                <Route path="/year/:year" element={<YearPage />} />
                <Route path="/date/:date" element={<DatePage />} />

                <Route path="/fav" element={<FavPage />} />

                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
        </RefreshTimestampGate>
    </PageLayout>
);
