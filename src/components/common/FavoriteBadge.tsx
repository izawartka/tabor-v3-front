import type { JSX } from 'react';
import styled from 'styled-components';

export const FAVORITE_BADGE_TEXT = '★ Dobre';

const Badge = styled.div`
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 3;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid ${({ theme }): string => theme.colors.border};
    background: ${({ theme }): string => theme.colors.overlay};
    color: ${({ theme }): string => theme.colors.text};
    border-radius: 999px;
    padding: 6px 10px;
`;

export const FavoriteBadge = (): JSX.Element => <Badge>{FAVORITE_BADGE_TEXT}</Badge>;
