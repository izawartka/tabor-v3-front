import type { JSX } from 'react';
import styled from 'styled-components';
import { PrivateModeToggle } from './PrivateModeToggle';
import { SchemeToggle } from './SchemeToggle';

const StyledContainer = styled.div`
    display: inline-flex;
    align-items: center;
    flex-direction: row;
    gap: 8px;
`;

export const TopNavActions = (): JSX.Element => (
    <StyledContainer>
        <PrivateModeToggle />
        <SchemeToggle />
    </StyledContainer>
);
