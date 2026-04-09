import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    EVENT_MEDIA_VIEW_PHOTO_ALT,
    EVENT_MEDIA_VIEW_TOGGLE_TO_PHOTO_TEXT,
    EVENT_MEDIA_VIEW_TOGGLE_TO_VIDEO_TEXT,
    EVENT_MEDIA_VIEW_YOUTUBE_BASE_URL,
    EventMediaView
} from '../EventMediaView';
import { renderWithTheme } from '../../../test/renderWithTheme';
import {
    FAVORITE_BADGE_TEXT,
    PLACE_MISMATCH_PHOTO_BADGE_TEXT,
    PLACE_MISMATCH_VIDEO_BADGE_TEXT
} from '../MediaBadges';
import { createEventMedia } from '../../../test/factories/api';

describe('EventMediaView', (): void => {
    it('returns null when no media is available', (): void => {
        const { container } = renderWithTheme(
            <EventMediaView
                media={createEventMedia({
                    photo: null,
                    video: null,
                    photo_fav: false,
                    video_fav: false
                })}
            />
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('renders favorite badge for current visible video and toggles to photo', async (): Promise<void> => {
        const user = userEvent.setup();
        renderWithTheme(
            <EventMediaView
                media={createEventMedia({ photo: 'p1', video: 'abc', video_fav: true })}
            />
        );

        expect(screen.getByText(FAVORITE_BADGE_TEXT)).toBeInTheDocument();
        expect(screen.getByTitle('YouTube video abc')).toHaveAttribute(
            'src',
            `${EVENT_MEDIA_VIEW_YOUTUBE_BASE_URL}abc`
        );

        await user.click(
            screen.getByRole('button', { name: EVENT_MEDIA_VIEW_TOGGLE_TO_PHOTO_TEXT })
        );

        expect(screen.getByRole('img', { name: EVENT_MEDIA_VIEW_PHOTO_ALT })).toBeInTheDocument();
        expect(screen.queryByText(FAVORITE_BADGE_TEXT)).not.toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: EVENT_MEDIA_VIEW_TOGGLE_TO_VIDEO_TEXT })
        ).toBeInTheDocument();
    });

    it('renders photo view when only photo exists', (): void => {
        renderWithTheme(
            <EventMediaView
                media={createEventMedia({ photo: 'p1', video: null, photo_fav: false })}
            />
        );

        expect(screen.getByRole('img', { name: EVENT_MEDIA_VIEW_PHOTO_ALT })).toBeInTheDocument();
        expect(screen.queryByTitle(/YouTube video/)).not.toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('renders video view when only video exists', (): void => {
        renderWithTheme(
            <EventMediaView
                media={createEventMedia({ photo: null, video: 'yt123', video_fav: false })}
            />
        );

        expect(screen.getByTitle('YouTube video yt123')).toHaveAttribute(
            'src',
            `${EVENT_MEDIA_VIEW_YOUTUBE_BASE_URL}yt123`
        );
        expect(
            screen.queryByRole('img', { name: EVENT_MEDIA_VIEW_PHOTO_ALT })
        ).not.toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('toggles from video to photo and back when both media types exist', async (): Promise<void> => {
        const user = userEvent.setup();
        renderWithTheme(<EventMediaView media={createEventMedia({ photo: 'p1', video: 'yt1' })} />);

        expect(screen.getByTitle('YouTube video yt1')).toBeInTheDocument();

        await user.click(
            screen.getByRole('button', { name: EVENT_MEDIA_VIEW_TOGGLE_TO_PHOTO_TEXT })
        );
        expect(screen.getByRole('img', { name: EVENT_MEDIA_VIEW_PHOTO_ALT })).toBeInTheDocument();

        await user.click(
            screen.getByRole('button', { name: EVENT_MEDIA_VIEW_TOGGLE_TO_VIDEO_TEXT })
        );
        expect(screen.getByTitle('YouTube video yt1')).toBeInTheDocument();
    });

    it('updates favorite badge based on current visible media', async (): Promise<void> => {
        const user = userEvent.setup();
        renderWithTheme(
            <EventMediaView
                media={createEventMedia({
                    photo: 'p1',
                    video: 'yt2',
                    photo_fav: true,
                    video_fav: false
                })}
            />
        );

        expect(screen.queryByText(FAVORITE_BADGE_TEXT)).not.toBeInTheDocument();

        await user.click(
            screen.getByRole('button', { name: EVENT_MEDIA_VIEW_TOGGLE_TO_PHOTO_TEXT })
        );

        expect(screen.getByText(FAVORITE_BADGE_TEXT)).toBeInTheDocument();
    });

    it('renders place mismatch badge text based on currently visible media', async (): Promise<void> => {
        const user = userEvent.setup();

        renderWithTheme(
            <EventMediaView
                media={createEventMedia({
                    photo: '123',
                    video: 'yt3',
                    place_mismatch: true
                })}
            />
        );

        expect(screen.getByText(PLACE_MISMATCH_VIDEO_BADGE_TEXT)).toBeInTheDocument();

        await user.click(
            screen.getByRole('button', { name: EVENT_MEDIA_VIEW_TOGGLE_TO_PHOTO_TEXT })
        );

        expect(screen.getByText(PLACE_MISMATCH_PHOTO_BADGE_TEXT)).toBeInTheDocument();
        expect(screen.queryByText(PLACE_MISMATCH_VIDEO_BADGE_TEXT)).not.toBeInTheDocument();
    });
});
