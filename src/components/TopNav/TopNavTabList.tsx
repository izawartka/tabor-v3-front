import type { JSX } from 'react';
import styled from 'styled-components';
import { TOP_NAV_ARIA_LABEL, TOP_NAV_LABEL, TOP_NAV_TABS } from './TopNav.constants';
import { TopNavLink } from './TopNavLink';

export type TopNavTabListOrientation = 'horizontal' | 'vertical';

export interface TopNavTabListProps {
    pathname: string;
    orientation?: TopNavTabListOrientation;
    onTabClick?: () => void;
    ariaLabel?: string;
}

const inAnyPath = (pathName: string, prefixes: readonly string[]): boolean => {
    if (prefixes.includes(pathName)) {
        return true;
    }

    return prefixes.some(prefix => pathName.startsWith(`${prefix}/`));
};

const StyledNav = styled.nav<{ $orientation: TopNavTabListOrientation }>`
    display: flex;
    flex-direction: ${({ $orientation }): string =>
        $orientation === 'horizontal' ? 'row' : 'column'};
    gap: ${({ $orientation }): string => ($orientation === 'horizontal' ? '10px' : '8px')};
    align-items: ${({ $orientation }): string =>
        $orientation === 'horizontal' ? 'center' : 'stretch'};
`;

const StyledLabel = styled.span<{ $orientation: TopNavTabListOrientation }>`
    color: ${({ theme }): string => theme.colors.secondaryText};
    font-weight: 600;
    white-space: nowrap;
    flex-shrink: 0;
    margin-bottom: ${({ $orientation }): string => ($orientation === 'horizontal' ? '0' : '2px')};
`;

const StyledLinks = styled.div<{ $orientation: TopNavTabListOrientation }>`
    display: flex;
    flex-wrap: ${({ $orientation }): string => ($orientation === 'horizontal' ? 'wrap' : 'nowrap')};
    flex-direction: ${({ $orientation }): string =>
        $orientation === 'horizontal' ? 'row' : 'column'};
    gap: 8px;
    align-items: ${({ $orientation }): string =>
        $orientation === 'horizontal' ? 'center' : 'stretch'};
`;

export const TopNavTabList = ({
    pathname,
    orientation = 'horizontal',
    onTabClick,
    ariaLabel = TOP_NAV_ARIA_LABEL
}: TopNavTabListProps): JSX.Element => (
    <StyledNav $orientation={orientation} aria-label={ariaLabel}>
        <StyledLabel $orientation={orientation}>{TOP_NAV_LABEL}</StyledLabel>
        <StyledLinks $orientation={orientation}>
            {TOP_NAV_TABS.map(tab => {
                const isActive = inAnyPath(pathname, tab.activePaths);

                return (
                    <TopNavLink key={tab.to} to={tab.to} isActive={isActive} onClick={onTabClick}>
                        {tab.label}
                    </TopNavLink>
                );
            })}
        </StyledLinks>
    </StyledNav>
);
