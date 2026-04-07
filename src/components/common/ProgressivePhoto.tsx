import {
    type JSX,
    type SyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import styled from 'styled-components';
import { getPhotoUrl, getThumbPhotoUrl } from '../../utils/paths';

const Wrapper = styled.div`
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: ${({ theme }): string => theme.radii.md};
    overflow: hidden;
    background: ${({ theme }): string => theme.colors.mediaFallbackBg};
    border: 1px solid ${({ theme }): string => theme.colors.border};
    position: relative;
`;

const Layer = styled.img<{ $visible: boolean }>`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: ${({ $visible }): 0 | 1 => ($visible ? 1 : 0)};
    transition: opacity 0.25s ease;
`;

const Fallback = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    color: ${({ theme }): string => theme.colors.muted};
    font-size: 1rem;
`;

interface ProgressivePhotoProps {
    photoId: string | null;
    alt: string;
    forceFull?: boolean;
}

export const PROGRESSIVE_PHOTO_LOAD_FULL_THRESHOLD = 1.25;
export const PROGRESSIVE_PHOTO_EMPTY_TEXT = 'Brak zdjęcia';
export const PROGRESSIVE_PHOTO_ERROR_TEXT = 'Nie udało się załadować zdjęcia';

export const ProgressivePhoto = ({
    photoId,
    alt,
    forceFull = false
}: ProgressivePhotoProps): JSX.Element => {
    const thumbRef = useRef<HTMLImageElement | null>(null);

    const thumbSrc = useMemo((): string | null => getThumbPhotoUrl(photoId), [photoId]);
    const fullSrc = useMemo((): string | null => getPhotoUrl(photoId), [photoId]);

    const [thumbLoaded, setThumbLoaded] = useState(false);
    const [thumbError, setThumbError] = useState(false);
    const [shouldLoadFull, setShouldLoadFull] = useState(forceFull);
    const [fullLoaded, setFullLoaded] = useState(false);
    const [fullError, setFullError] = useState(false);

    const evaluateThumbDimensions = useCallback(
        (element: HTMLImageElement): void => {
            setThumbLoaded(true);

            if (forceFull) {
                setShouldLoadFull(true);
                return;
            }

            const renderedWidth = element.getBoundingClientRect().width;
            const { naturalWidth, naturalHeight } = element;

            if (naturalWidth <= 0 || naturalHeight <= 0) {
                setShouldLoadFull(forceFull);
                return;
            }

            setShouldLoadFull(renderedWidth > naturalWidth * PROGRESSIVE_PHOTO_LOAD_FULL_THRESHOLD);
        },
        [forceFull]
    );

    const handleThumbLoad = (event: SyntheticEvent<HTMLImageElement>): void => {
        evaluateThumbDimensions(event.currentTarget);
    };

    useEffect((): void => {
        if (thumbSrc === null || thumbLoaded || thumbError) {
            return;
        }

        const element = thumbRef.current;
        if (!element?.complete) {
            return;
        }

        evaluateThumbDimensions(element);
    }, [thumbSrc, thumbLoaded, thumbError, evaluateThumbDimensions]);

    if (thumbSrc === null) {
        return (
            <Wrapper>
                <Fallback>{PROGRESSIVE_PHOTO_EMPTY_TEXT}</Fallback>
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            <Layer
                ref={thumbRef}
                src={thumbSrc}
                alt={alt}
                loading="lazy"
                $visible={!fullLoaded && !thumbError}
                onLoad={handleThumbLoad}
                onError={(): void => setThumbError(true)}
            />
            {thumbLoaded && shouldLoadFull && !fullError && fullSrc !== null ? (
                <Layer
                    src={fullSrc}
                    alt={alt}
                    loading="lazy"
                    $visible={fullLoaded}
                    onLoad={(): void => setFullLoaded(true)}
                    onError={(): void => setFullError(true)}
                />
            ) : null}
            {thumbError || (shouldLoadFull && fullError && !fullLoaded) ? (
                <Fallback>{PROGRESSIVE_PHOTO_ERROR_TEXT}</Fallback>
            ) : null}
        </Wrapper>
    );
};
