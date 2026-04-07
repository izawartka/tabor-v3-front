import type { JSX } from 'react';
import styled from 'styled-components';
import { TopNav } from '../TopNav/TopNav';

const Main = styled.main`
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px;
`;

export const PageLayout = ({ children }: { children: React.ReactNode }): JSX.Element => (
    <>
        <TopNav />
        <Main>{children}</Main>
    </>
);
