import type { JSX } from 'react';
import { useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { TOP_NAV_LABEL, TOP_NAV_TABS, TOP_NAV_ARIA_LABEL } from './TopNav.constants';
import { SchemeToggle } from './SchemeToggle';

const Header = styled.header`
    background: ${({ theme }): string => theme.colors.surface};
    border-bottom: 1px solid ${({ theme }): string => theme.colors.border};
    position: sticky;
    top: 0;
    z-index: 9;
`;

const Inner = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 12px 16px;
    display: flex;
    align-items: center;

    @media (max-width: ${({ theme }): string => `${theme.breakpoints.mobile}px`}) {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 8px 10px;
        padding: 10px 12px;
    }
`;

const Label = styled.span`
    color: ${({ theme }): string => theme.colors.secondaryText};
    font-weight: 600;
    white-space: nowrap;
    flex-shrink: 0;

    @media (max-width: ${({ theme }): string => `${theme.breakpoints.mobile}px`}) {
        font-size: 0.9rem;
        line-height: 1.2;
    }
`;

const Items = styled.nav`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;

    @media (max-width: ${({ theme }): string => `${theme.breakpoints.mobile}px`}) {
        grid-column: 1 / 2;
        min-width: 0;
        flex-wrap: nowrap;
        gap: 8px;
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: thin;
        padding-bottom: 2px;
    }
`;

const Spacer = styled.div`
    margin-left: auto;

    @media (max-width: ${({ theme }): string => `${theme.breakpoints.mobile}px`}) {
        display: none;
    }
`;

const Item = styled(Link)<{ $active: boolean }>`
    padding: 8px 12px;
    border-radius: 999px;
    border: 1px solid ${({ theme }): string => theme.colors.border};
    color: ${({ theme, $active }): string => ($active ? theme.colors.accent : theme.colors.text)};
    background: ${({ theme, $active }): string =>
        $active ? theme.colors.accentSoft : theme.colors.surface};
    font-weight: ${({ $active }): 700 | 500 => ($active ? 700 : 500)};
    text-select: none;
    white-space: nowrap;

    @media (max-width: ${({ theme }): string => `${theme.breakpoints.mobile}px`}) {
        padding: 6px 10px;
        font-size: 0.9rem;
    }
`;

const inAnyPath = (pathName: string, prefixes: readonly string[]): boolean => {
    if (prefixes.includes(pathName)) {
        return true;
    }

    return prefixes.some(prefix => pathName.startsWith(`${prefix}/`));
};

export const TopNav = (): JSX.Element => {
    const location = useLocation();

    return (
        <Header>
            <Inner>
                <Items aria-label={TOP_NAV_ARIA_LABEL}>
                    <Label>{TOP_NAV_LABEL}</Label>
                    {TOP_NAV_TABS.map(tab => {
                        const isActive = inAnyPath(location.pathname, tab.activePaths);

                        return (
                            <Item key={tab.to} to={tab.to} $active={isActive}>
                                {tab.label}
                            </Item>
                        );
                    })}
                </Items>
                <Spacer />
                <SchemeToggle />
            </Inner>
        </Header>
    );
};
