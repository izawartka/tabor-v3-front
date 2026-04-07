import { Navigate, Route, Routes } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout/PageLayout';
import { RefreshTimestampGate } from './RefreshTimestampGate';
import { LocoPage } from '../pages/LocoPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PlaceholderEventGroupsPage, PlaceholderEventListPage } from '../pages/PlaceholderPage';
import { TypePage } from '../pages/TypePage';
import { TypesPage } from '../pages/TypesPage';
import type { JSX } from 'react';

export const AppRouter = (): JSX.Element => (
    <PageLayout>
        <RefreshTimestampGate>
            <Routes>
                <Route path="/" element={<TypesPage />} />
                <Route path="/types" element={<TypesPage />} />
                <Route path="/type/:id" element={<TypePage />} />
                <Route path="/loco/:id" element={<LocoPage />} />

                <Route path="/places" element={<PlaceholderEventGroupsPage />} />
                <Route path="/place/:id" element={<PlaceholderEventListPage />} />

                <Route path="/years" element={<PlaceholderEventGroupsPage />} />
                <Route path="/year/:id" element={<PlaceholderEventGroupsPage />} />
                <Route path="/date/:id" element={<PlaceholderEventListPage />} />

                <Route path="/fav" element={<PlaceholderEventListPage />} />

                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
        </RefreshTimestampGate>
    </PageLayout>
);
