import type { JSX } from 'react';
import styled from 'styled-components';

const StyledBadgesContainer = styled.div`
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const StyledBadge = styled.div`
    background: ${({ theme }): string => theme.colors.overlay};
    color: ${({ theme }): string => theme.colors.text};
    border: 1px solid ${({ theme }): string => theme.colors.border};
    border-radius: 16px;
    padding: 6px 10px 7px 10px;
`;

export const FAVORITE_BADGE_TEXT = '★ Dobre';
export const PLACE_MISMATCH_PHOTO_BADGE_TEXT = 'Zdjęcie z innego miejsca';
export const PLACE_MISMATCH_VIDEO_BADGE_TEXT = 'Film z innego miejsca';

const FavoriteBadge = (): JSX.Element => <StyledBadge>{FAVORITE_BADGE_TEXT}</StyledBadge>;
const PlaceMismatchBadge = ({ isPhoto }: { isPhoto: boolean }): JSX.Element => (
    <StyledBadge>
        {isPhoto ? PLACE_MISMATCH_PHOTO_BADGE_TEXT : PLACE_MISMATCH_VIDEO_BADGE_TEXT}
    </StyledBadge>
);

export interface MediaBadgesProps {
    showFavorite: boolean;
    showPlaceMismatch: boolean;
    isPhoto: boolean;
}

export const MediaBadges = ({
    showFavorite,
    showPlaceMismatch,
    isPhoto
}: MediaBadgesProps): JSX.Element | null => {
    if (!showFavorite && !showPlaceMismatch) {
        return null;
    }

    return (
        <StyledBadgesContainer>
            {showFavorite ? <FavoriteBadge /> : null}
            {showPlaceMismatch ? <PlaceMismatchBadge isPhoto={isPhoto} /> : null}
        </StyledBadgesContainer>
    );
};
