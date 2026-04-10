import type { JSX } from 'react';
import styled, { useTheme } from 'styled-components';
import { usePrivateMode } from '../../contexts/usePrivateMode';
import {
    TOP_NAV_PRIVATE_MODE_OFF_LABEL,
    TOP_NAV_PRIVATE_MODE_ON_LABEL
} from './PrivateModeToggle.constants';
import { InfoIcon } from '../../icons/InfoIcon';

const ToggleButton = styled.button<{ $active: boolean }>`
    width: 38px;
    height: 38px;
    display: inline-grid;
    place-items: center;
    border-radius: 999px;
    border: 1px solid ${({ theme }): string => theme.colors.border};
    background: ${({ theme, $active }): string =>
        $active ? theme.colors.accentSoft : theme.colors.surfaceAlt};
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

export const PrivateModeToggle = (): JSX.Element => {
    const { privateMode, togglePrivateMode } = usePrivateMode();
    const theme = useTheme();
    const label = privateMode ? TOP_NAV_PRIVATE_MODE_ON_LABEL : TOP_NAV_PRIVATE_MODE_OFF_LABEL;

    return (
        <ToggleButton
            $active={privateMode}
            onClick={togglePrivateMode}
            aria-pressed={privateMode}
            aria-label={label}
            title={label}
        >
            <InfoIcon color={theme.colors.text} />
        </ToggleButton>
    );
};
