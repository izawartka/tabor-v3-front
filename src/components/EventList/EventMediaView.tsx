import { useMemo, useState } from 'react';
import type { JSX } from 'react';
import type { ApiEventMedia } from '../../types/api';
import styled from 'styled-components';
import { FavoriteBadge } from '../common/FavoriteBadge';
import { ProgressivePhoto } from '../common/ProgressivePhoto';

export const EVENT_MEDIA_VIEW_TOGGLE_TO_VIDEO_TEXT = 'Zobacz film';
export const EVENT_MEDIA_VIEW_TOGGLE_TO_PHOTO_TEXT = 'Zobacz zdjęcie';
export const EVENT_MEDIA_VIEW_PHOTO_ALT = 'Zdjęcie wpisu';
export const EVENT_MEDIA_VIEW_YOUTUBE_TITLE_PREFIX = 'YouTube video ';
export const EVENT_MEDIA_VIEW_YOUTUBE_BASE_URL = 'https://www.youtube.com/embed/';

const MediaWrap = styled.div`
    position: relative;
`;

const Iframe = styled.iframe`
    width: 100%;
    aspect-ratio: 16 / 9;
    border: 0;
    display: block;
`;

const MediaSwitch = styled.button`
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 3;
    border: 1px solid ${({ theme }): string => theme.colors.border};
    background: ${({ theme }): string => theme.colors.overlay};
    color: ${({ theme }): string => theme.colors.text};
    border-radius: 999px;
    padding: 6px 10px;
    cursor: pointer;
`;

export const EventMediaView = ({ media }: { media: ApiEventMedia }): JSX.Element | null => {
    const photoId = media.photo;
    const videoId = media.video;

    const hasVideo = Boolean(videoId);
    const hasPhoto = Boolean(photoId);

    const [showPhoto, setShowPhoto] = useState<boolean>(!hasVideo);

    const shouldShowMedia = hasVideo || hasPhoto;

    const currentFav = useMemo((): boolean => {
        if (showPhoto) {
            return Boolean(media?.photo_fav);
        }

        return Boolean(media?.video_fav);
    }, [media?.photo_fav, media?.video_fav, showPhoto]);

    if (!shouldShowMedia) {
        return null;
    }

    return (
        <MediaWrap>
            {currentFav ? <FavoriteBadge /> : null}
            {hasVideo && hasPhoto ? (
                <MediaSwitch onClick={(): void => setShowPhoto(value => !value)}>
                    {showPhoto
                        ? EVENT_MEDIA_VIEW_TOGGLE_TO_VIDEO_TEXT
                        : EVENT_MEDIA_VIEW_TOGGLE_TO_PHOTO_TEXT}
                </MediaSwitch>
            ) : null}

            {showPhoto && hasPhoto ? (
                <ProgressivePhoto photoId={photoId} alt={EVENT_MEDIA_VIEW_PHOTO_ALT} forceFull />
            ) : null}
            {!showPhoto && hasVideo ? (
                <Iframe
                    src={`${EVENT_MEDIA_VIEW_YOUTUBE_BASE_URL}${videoId}`}
                    title={`${EVENT_MEDIA_VIEW_YOUTUBE_TITLE_PREFIX}${videoId}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            ) : null}
        </MediaWrap>
    );
};
