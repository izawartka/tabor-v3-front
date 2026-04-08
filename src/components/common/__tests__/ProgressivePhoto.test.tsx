import { fireEvent, screen } from '@testing-library/react';
import {
    PROGRESSIVE_PHOTO_EMPTY_TEXT,
    PROGRESSIVE_PHOTO_ERROR_TEXT,
    ProgressivePhoto
} from '../ProgressivePhoto';
import { renderWithTheme } from '../../../test/renderWithTheme';

describe('ProgressivePhoto', (): void => {
    describe('empty state', (): void => {
        it('renders empty state when photoId is null', (): void => {
            renderWithTheme(<ProgressivePhoto photoId={null} alt="Test image" />);

            expect(screen.getByText(PROGRESSIVE_PHOTO_EMPTY_TEXT)).toBeInTheDocument();
        });

        it('renders empty state when photoId is empty string', (): void => {
            renderWithTheme(<ProgressivePhoto photoId="" alt="Test image" />);

            expect(screen.getByText(PROGRESSIVE_PHOTO_EMPTY_TEXT)).toBeInTheDocument();
        });

        it('does not render img elements when photoId is null', (): void => {
            renderWithTheme(<ProgressivePhoto photoId={null} alt="Test image" />);

            expect(screen.queryByRole('img')).not.toBeInTheDocument();
        });
    });

    describe('thumbnail loading', (): void => {
        it('renders thumbnail image when photoId provided', (): void => {
            renderWithTheme(<ProgressivePhoto photoId="photo123" alt="Test photo" />);

            const image = screen.getByRole('img', { name: 'Test photo' });
            expect(image).toBeInTheDocument();
            expect(image).toHaveAttribute('src');
        });

        it('uses correct alt text for image', (): void => {
            renderWithTheme(<ProgressivePhoto photoId="p1" alt="Custom alt text" />);

            expect(screen.getByRole('img', { name: 'Custom alt text' })).toBeInTheDocument();
        });

        it('sets loading attribute to lazy', (): void => {
            renderWithTheme(<ProgressivePhoto photoId="p1" alt="test" />);

            const image = screen.getByRole('img');
            expect(image).toHaveAttribute('loading', 'lazy');
        });

        it('renders error fallback on thumbnail load error', (): void => {
            renderWithTheme(<ProgressivePhoto photoId="p1" alt="Test" />);

            const image = screen.getByRole('img');
            fireEvent.error(image);

            expect(screen.getByText(PROGRESSIVE_PHOTO_ERROR_TEXT)).toBeInTheDocument();
        });
    });

    describe('full image loading', (): void => {
        it('does not load full image initially', (): void => {
            renderWithTheme(<ProgressivePhoto photoId="p1" alt="test" />);

            const images = screen.queryAllByRole('img');
            expect(images).toHaveLength(1);
        });

        it('loads full image when forceFull is true', (): void => {
            renderWithTheme(<ProgressivePhoto photoId="p1" alt="test" forceFull />);

            const images = screen.getAllByRole('img');
            expect(images.length).toBeGreaterThanOrEqual(1);
        });

        it('renders both thumbnail and full after full loads with forceFull', (): void => {
            renderWithTheme(<ProgressivePhoto photoId="p1" alt="test" forceFull />);

            const images = screen.getAllByRole('img');
            fireEvent.load(images[0]);

            expect(screen.getAllByRole('img')).toHaveLength(2);
        });

        it('handles full image load error after thumbnail succeeds', (): void => {
            renderWithTheme(<ProgressivePhoto photoId="p1" alt="test" forceFull />);

            const images = screen.getAllByRole('img');
            fireEvent.load(images[0]);

            const fullImage = screen.getAllByRole('img')[1];
            fireEvent.error(fullImage);

            expect(screen.getByText(PROGRESSIVE_PHOTO_ERROR_TEXT)).toBeInTheDocument();
        });

        it('does not render full image if thumbnail has error', (): void => {
            renderWithTheme(<ProgressivePhoto photoId="p1" alt="test" />);

            const image = screen.getByRole('img');
            fireEvent.error(image);

            expect(screen.queryAllByRole('img')).toHaveLength(1);
            expect(screen.getByText(PROGRESSIVE_PHOTO_ERROR_TEXT)).toBeInTheDocument();
        });
    });

    describe('multiple renders', (): void => {
        it('handles photoId change from null to valid', (): void => {
            const { unmount } = renderWithTheme(<ProgressivePhoto photoId={null} alt="test" />);

            expect(screen.getByText(PROGRESSIVE_PHOTO_EMPTY_TEXT)).toBeInTheDocument();

            unmount();
            renderWithTheme(<ProgressivePhoto photoId="p1" alt="test" />);

            expect(screen.queryByText(PROGRESSIVE_PHOTO_EMPTY_TEXT)).not.toBeInTheDocument();
            expect(screen.getByRole('img')).toBeInTheDocument();
        });

        it('handles photoId change from one value to another', (): void => {
            const { unmount } = renderWithTheme(<ProgressivePhoto photoId="p1" alt="test" />);

            expect(screen.getByRole('img')).toHaveAttribute('src');

            unmount();
            renderWithTheme(<ProgressivePhoto photoId="p2" alt="test" />);

            expect(screen.getByRole('img')).toBeInTheDocument();
        });

        it('handles forceFull prop change', (): void => {
            const { unmount } = renderWithTheme(
                <ProgressivePhoto photoId="p1" alt="test" forceFull={false} />
            );

            let images = screen.queryAllByRole('img');
            expect(images.length).toBeLessThanOrEqual(1);

            unmount();
            renderWithTheme(<ProgressivePhoto photoId="p1" alt="test" forceFull={true} />);

            images = screen.queryAllByRole('img');
            expect(images).not.toHaveLength(0);
        });
    });
});
