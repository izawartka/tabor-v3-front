import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReferenceTooltip } from '../ReferenceTooltip';
import { renderWithTheme } from '../../../test/renderWithTheme';
import { createReference } from '../../../test/factories/api';

describe('ReferenceTooltip', (): void => {
    beforeEach((): void => {
        vi.restoreAllMocks();
    });

    describe('tooltip content', (): void => {
        it('renders tooltip content with hint', async (): Promise<void> => {
            const user = userEvent.setup();
            vi.spyOn(window, 'matchMedia').mockImplementation(
                () => ({ matches: true }) as MediaQueryList
            );

            renderWithTheme(
                <ReferenceTooltip reference={createReference()} hintText="Event details">
                    <button>Hover me</button>
                </ReferenceTooltip>
            );

            await user.hover(screen.getByRole('button', { name: 'Hover me' }));

            expect(screen.getByText('Event details')).toBeInTheDocument();
        });

        it('renders tooltip with photo', async (): Promise<void> => {
            const user = userEvent.setup();
            vi.spyOn(window, 'matchMedia').mockImplementation(
                () => ({ matches: true }) as MediaQueryList
            );

            renderWithTheme(
                <ReferenceTooltip reference={createReference()} hintText="Details">
                    <button>Hover</button>
                </ReferenceTooltip>
            );

            await user.hover(screen.getByRole('button'));

            expect(screen.getByRole('img', { name: 'Miniatura' })).toBeInTheDocument();
            expect(screen.getByText('Details')).toBeInTheDocument();
        });
    });

    describe('reference data', (): void => {
        it('uses reference data from props', async (): Promise<void> => {
            const user = userEvent.setup();
            vi.spyOn(window, 'matchMedia').mockImplementation(
                () => ({ matches: true }) as MediaQueryList
            );

            const reference = createReference({ thumb: '999', event_count: 42 });

            renderWithTheme(
                <ReferenceTooltip reference={reference} hintText="Test">
                    <button>Hover</button>
                </ReferenceTooltip>
            );

            await user.hover(screen.getByRole('button'));

            const image = screen.getByRole('img', { name: 'Miniatura' });
            expect(image).toBeInTheDocument();
            expect(image).toHaveAttribute('src');
        });
    });

    describe('hint text', (): void => {
        it('accepts hint text prop', async (): Promise<void> => {
            const user = userEvent.setup();
            vi.spyOn(window, 'matchMedia').mockImplementation(
                () => ({ matches: true }) as MediaQueryList
            );

            renderWithTheme(
                <ReferenceTooltip reference={createReference()} hintText="Custom hint text">
                    <button>Click</button>
                </ReferenceTooltip>
            );

            await user.hover(screen.getByRole('button'));

            expect(screen.getByText('Custom hint text')).toBeInTheDocument();
        });

        it('renders without hint text when not provided', async (): Promise<void> => {
            const user = userEvent.setup();
            vi.spyOn(window, 'matchMedia').mockImplementation(
                () => ({ matches: true }) as MediaQueryList
            );

            renderWithTheme(
                <ReferenceTooltip reference={createReference()}>
                    <button>Click</button>
                </ReferenceTooltip>
            );

            await user.hover(screen.getByRole('button'));

            expect(screen.getByRole('tooltip')).toBeInTheDocument();
        });
    });

    describe('children rendering', (): void => {
        it('renders anchor element', (): void => {
            renderWithTheme(
                <ReferenceTooltip reference={createReference()}>
                    <button>Anchor button</button>
                </ReferenceTooltip>
            );

            expect(screen.getByRole('button', { name: 'Anchor button' })).toBeInTheDocument();
        });

        it('renders link as anchor', (): void => {
            renderWithTheme(
                <ReferenceTooltip reference={createReference()}>
                    <a href="#test">Link anchor</a>
                </ReferenceTooltip>
            );

            expect(screen.getByRole('link', { name: 'Link anchor' })).toBeInTheDocument();
        });
    });

    describe('hover interaction', (): void => {
        it('shows tooltip on hover', async (): Promise<void> => {
            const user = userEvent.setup();
            vi.spyOn(window, 'matchMedia').mockImplementation(
                () => ({ matches: true }) as MediaQueryList
            );

            renderWithTheme(
                <ReferenceTooltip reference={createReference()} hintText="Hover hint">
                    <button>Hover me</button>
                </ReferenceTooltip>
            );

            expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

            await user.hover(screen.getByRole('button'));

            expect(screen.getByRole('tooltip')).toBeInTheDocument();
        });

        it('hides tooltip on unhover', async (): Promise<void> => {
            const user = userEvent.setup();
            vi.spyOn(window, 'matchMedia').mockImplementation(
                () => ({ matches: true }) as MediaQueryList
            );

            renderWithTheme(
                <ReferenceTooltip reference={createReference()} hintText="Hint">
                    <button>Hover me</button>
                </ReferenceTooltip>
            );

            const button = screen.getByRole('button');
            await user.hover(button);
            expect(screen.getByRole('tooltip')).toBeInTheDocument();

            await user.unhover(button);
            expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        });
    });

    describe('touch/tap interaction', (): void => {
        it('requires enableTapOnTouch to be set for tap interaction', (): void => {
            vi.spyOn(window, 'matchMedia').mockImplementation(
                () => ({ matches: false }) as MediaQueryList
            );

            renderWithTheme(
                <ReferenceTooltip reference={createReference()} hintText="Tap hint">
                    <button>Tap me</button>
                </ReferenceTooltip>
            );

            expect(screen.getByRole('button')).toBeInTheDocument();
        });
    });

    describe('type safety', (): void => {
        it('accepts ApiReference type', (): void => {
            const ref = createReference();
            renderWithTheme(
                <ReferenceTooltip reference={ref} hintText="Text">
                    <button>Anchor</button>
                </ReferenceTooltip>
            );

            expect(screen.getByRole('button')).toBeInTheDocument();
        });
    });
});
