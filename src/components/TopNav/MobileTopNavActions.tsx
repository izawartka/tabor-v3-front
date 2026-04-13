import type { JSX } from 'react';
import styled from 'styled-components';
import { PrivateModeToggle } from './PrivateModeToggle';
import { SchemeToggle } from './SchemeToggle';
import { TOP_NAV_SETTINGS_LABEL } from './TopNav.constants';

const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    white-space: nowrap;
    flex-shrink: 0;
`;

const StyledLabel = styled.span`
    color: ${({ theme }): string => theme.colors.secondaryText};
    font-weight: 600;
    margin-bottom: 2px;
`;

export const MobileTopNavActions = (): JSX.Element => (
    <StyledContainer>
        <StyledLabel>{TOP_NAV_SETTINGS_LABEL}</StyledLabel>
        <PrivateModeToggle showLabel={true} />
        <SchemeToggle showLabel={true} />
    </StyledContainer>
);
