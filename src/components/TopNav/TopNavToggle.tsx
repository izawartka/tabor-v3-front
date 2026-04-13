import type { JSX } from 'react';
import styled from 'styled-components';

const StyledButton = styled.button<{ $isOn: boolean; $hasLabel: boolean }>`
    display: grid;
    place-items: center;
    grid-auto-flow: column;
    justify-content: start;
    font-size: inherit;
    color: ${({ theme }): string => theme.colors.text};
    border-radius: ${({ $hasLabel }): string => ($hasLabel ? '0' : '999px')};
    cursor: pointer;
    padding: 0;
    border: none;
    background: none;
    gap: 8px;
`;

const StyledIconCont = styled.div<{ $isOn: boolean }>`
    width: 38px;
    height: 38px;
    border-radius: 999px;
    border: 1px solid ${({ theme }): string => theme.colors.border};
    background: ${({ theme, $isOn }): string =>
        $isOn ? theme.colors.accentSoft : theme.colors.surfaceAlt};

    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export interface TopNavToggleProps {
    icon: JSX.Element;
    onClick: () => void;
    isOn: boolean;
    ariaLabel: string;
    label: string;
    showLabel?: boolean;
}

export const TopNavToggle = ({
    icon,
    onClick,
    isOn,
    ariaLabel,
    label,
    showLabel = false
}: TopNavToggleProps): JSX.Element => {
    return (
        <StyledButton
            onClick={onClick}
            $isOn={isOn}
            $hasLabel={showLabel}
            aria-label={ariaLabel}
            title={label}
        >
            <StyledIconCont $isOn={isOn}>{icon}</StyledIconCont>
            {showLabel && label}
        </StyledButton>
    );
};
