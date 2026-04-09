import { screen } from '@testing-library/react';
import {
    FAVORITE_BADGE_TEXT,
    MediaBadges,
    PLACE_MISMATCH_PHOTO_BADGE_TEXT,
    PLACE_MISMATCH_VIDEO_BADGE_TEXT
} from '../MediaBadges';
import { renderWithTheme } from '../../../test/renderWithTheme';

describe('MediaBadges', (): void => {
    it('returns null when no badges should be shown', (): void => {
        const { container } = renderWithTheme(
            <MediaBadges showFavorite={false} showPlaceMismatch={false} isPhoto={true} />
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('renders only favorite badge', (): void => {
        renderWithTheme(<MediaBadges showFavorite showPlaceMismatch={false} isPhoto={true} />);

        expect(screen.getByText(FAVORITE_BADGE_TEXT)).toBeInTheDocument();
        expect(screen.queryByText(PLACE_MISMATCH_PHOTO_BADGE_TEXT)).not.toBeInTheDocument();
        expect(screen.queryByText(PLACE_MISMATCH_VIDEO_BADGE_TEXT)).not.toBeInTheDocument();
    });

    it('renders photo mismatch badge text for photo media', (): void => {
        renderWithTheme(<MediaBadges showFavorite={false} showPlaceMismatch isPhoto={true} />);

        expect(screen.getByText(PLACE_MISMATCH_PHOTO_BADGE_TEXT)).toBeInTheDocument();
        expect(screen.queryByText(PLACE_MISMATCH_VIDEO_BADGE_TEXT)).not.toBeInTheDocument();
    });

    it('renders video mismatch badge text for video media', (): void => {
        renderWithTheme(<MediaBadges showFavorite={false} showPlaceMismatch isPhoto={false} />);

        expect(screen.getByText(PLACE_MISMATCH_VIDEO_BADGE_TEXT)).toBeInTheDocument();
        expect(screen.queryByText(PLACE_MISMATCH_PHOTO_BADGE_TEXT)).not.toBeInTheDocument();
    });

    it('renders both badges when enabled', (): void => {
        renderWithTheme(<MediaBadges showFavorite showPlaceMismatch isPhoto={true} />);

        expect(screen.getByText(FAVORITE_BADGE_TEXT)).toBeInTheDocument();
        expect(screen.getByText(PLACE_MISMATCH_PHOTO_BADGE_TEXT)).toBeInTheDocument();
    });
});
