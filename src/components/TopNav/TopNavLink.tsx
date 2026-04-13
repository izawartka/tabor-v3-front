import type { JSX } from 'react';
import styled from 'styled-components';
import { PrefetchedLink } from '../common/PrefetchedLink';

export interface TopNavLinkProps {
    to: string;
    isActive: boolean;
    onClick?: () => void;
    children: string;
}

const StyledLink = styled(PrefetchedLink)<{ $active: boolean }>`
    padding: 8px 12px;
    border-radius: 999px;
    border: 1px solid ${({ theme }): string => theme.colors.border};
    color: ${({ theme, $active }): string => ($active ? theme.colors.accent : theme.colors.text)};
    background: ${({ theme, $active }): string =>
        $active ? theme.colors.accentSoft : theme.colors.surface};
    font-weight: ${({ $active }): 700 | 500 => ($active ? 700 : 500)};
    white-space: nowrap;
`;

export const TopNavLink = ({ to, isActive, onClick, children }: TopNavLinkProps): JSX.Element => (
    <StyledLink to={to} $active={isActive} onClick={onClick}>
        {children}
    </StyledLink>
);
