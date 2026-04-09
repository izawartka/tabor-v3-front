import type { JSX } from 'react';
import { useColorScheme } from '../../contexts/useColorScheme';
import { SunIcon } from '../../icons/SunIcon';
import { MoonIcon } from '../../icons/MoonIcon';
import styled, { useTheme } from 'styled-components';
import { TOP_NAV_DARK_MODE_LABEL, TOP_NAV_LIGHT_MODE_LABEL } from './SchemeToggle.constants';

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

    @media (max-width: ${({ theme }): string => `${theme.breakpoints.mobile}px`}) {
        grid-column: 2 / 3;
        justify-self: end;
        width: 32px;
        height: 32px;
    }
`;

export const SchemeToggle = (): JSX.Element => {
    const { scheme, toggleScheme } = useColorScheme();
    const theme = useTheme();

    return (
        <ToggleButton
            onClick={toggleScheme}
            aria-label={scheme === 'dark' ? TOP_NAV_DARK_MODE_LABEL : TOP_NAV_LIGHT_MODE_LABEL}
            title={scheme === 'dark' ? TOP_NAV_DARK_MODE_LABEL : TOP_NAV_LIGHT_MODE_LABEL}
        >
            {scheme === 'dark' ? (
                <SunIcon color={theme.colors.text} />
            ) : (
                <MoonIcon color={theme.colors.text} />
            )}
        </ToggleButton>
    );
};
