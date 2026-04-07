import type { JSX } from 'react';
import { useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useColorScheme } from '../../contexts/useColorScheme';
import {
    TOP_NAV_LABEL,
    TOP_NAV_TABS,
    TOP_NAV_DARK_MODE_LABEL,
    TOP_NAV_LIGHT_MODE_LABEL,
    TOP_NAV_ARIA_LABEL
} from './TopNav.constants';

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
    gap: 16px;
    flex-wrap: wrap;
`;

const Label = styled.span`
    color: ${({ theme }): string => theme.colors.secondaryText};
    font-weight: 600;
`;

const Items = styled.nav`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
`;

const Spacer = styled.div`
    margin-left: auto;
`;

const ToggleButton = styled.button`
    width: 38px;
    height: 38px;
    display: inline-grid;
    place-items: center;
    border-radius: 999px;
    border: 1px solid ${({ theme }): string => theme.colors.border};
    background: ${({ theme }): string => theme.colors.surfaceAlt};
    color: ${({ theme }): string => theme.colors.text};
    cursor: pointer;
    font-size: 1rem;
    text-select: none;
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
`;

const inAnyPath = (pathName: string, prefixes: readonly string[]): boolean => {
    if (prefixes.includes(pathName)) {
        return true;
    }

    return prefixes.some(prefix => pathName.startsWith(`${prefix}/`));
};

export const TopNav = (): JSX.Element => {
    const location = useLocation();
    const { scheme, toggleScheme } = useColorScheme();

    return (
        <Header>
            <Inner>
                <Label>{TOP_NAV_LABEL}</Label>
                <Items aria-label={TOP_NAV_ARIA_LABEL}>
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
                <ToggleButton
                    onClick={toggleScheme}
                    aria-label={
                        scheme === 'dark' ? TOP_NAV_DARK_MODE_LABEL : TOP_NAV_LIGHT_MODE_LABEL
                    }
                    title={scheme === 'dark' ? TOP_NAV_DARK_MODE_LABEL : TOP_NAV_LIGHT_MODE_LABEL}
                >
                    <span aria-hidden="true">{scheme === 'dark' ? '☀️' : '🌙'}</span>
                </ToggleButton>
            </Inner>
        </Header>
    );
};
