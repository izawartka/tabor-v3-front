import type { JSX } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import { TopNavTabList } from './TopNavTabList';
import { TopNavActions } from './TopNavActions';
import { MobileTopNavDrawer } from './MobileTopNavDrawer';
import { useMediaQuery } from '../../hooks/media/useMediaQuery';

const StyledHeader = styled.header`
    background: ${({ theme }): string => theme.colors.surface};
    border-bottom: 1px solid ${({ theme }): string => theme.colors.border};
    position: sticky;
    top: 0;
    z-index: 9;
`;

const StyledInner = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const StyledMobileInner = styled(StyledInner)`
    padding: 10px 12px;
`;

const StyledSpacer = styled.div`
    margin-left: auto;
`;

export const TopNav = (): JSX.Element => {
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.mobile}px)`);

    if (isMobile) {
        return (
            <StyledHeader>
                <StyledMobileInner>
                    <MobileTopNavDrawer key={location.pathname} pathname={location.pathname} />
                </StyledMobileInner>
            </StyledHeader>
        );
    }

    return (
        <StyledHeader>
            <StyledInner>
                <TopNavTabList pathname={location.pathname} />
                <StyledSpacer />
                <TopNavActions />
            </StyledInner>
        </StyledHeader>
    );
};
