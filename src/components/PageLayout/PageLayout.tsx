import type { JSX, ReactNode } from 'react';
import styled from 'styled-components';
import { TopNav } from '../TopNav/TopNav';
import { Footer } from './Footer';

const Main = styled.main`
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px;
`;

export const PageLayout = ({ children }: { children: ReactNode }): JSX.Element => (
    <>
        <TopNav />
        <Main>{children}</Main>
        <Footer />
    </>
);
