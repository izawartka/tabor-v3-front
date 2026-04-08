import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextWithTooltip } from '../TextWithTooltip';
import { renderWithTheme } from '../../../test/renderWithTheme';
import { DEFAULT_WIDTH } from '../HoverTooltip';

describe('TextWithTooltip', (): void => {
    beforeEach((): void => {
        vi.restoreAllMocks();
    });

    describe('text rendering', (): void => {
        it('renders text content', (): void => {
            renderWithTheme(<TextWithTooltip text="Label text" tooltipContent="Tooltip hint" />);

            expect(screen.getByText('Label text')).toBeInTheDocument();
        });

        it('renders text with dotted underline styling', (): void => {
            renderWithTheme(<TextWithTooltip text="Underlined" tooltipContent="Hint" />);

            const textElement = screen.getByText('Underlined');
            expect(textElement.tagName).toBe('SPAN');
            expect(textElement).toHaveStyle({
                textDecorationLine: 'underline',
                textDecorationStyle: 'dotted'
            });
            expect(textElement).toBeInTheDocument();
        });

        it('renders complex text content', (): void => {
            renderWithTheme(
                <TextWithTooltip
                    text={
                        <span>
                            Complex <strong>text</strong>
                        </span>
                    }
                    tooltipContent="Tooltip"
                />
            );

            expect(screen.getByText('Complex')).toBeInTheDocument();
            expect(screen.getByText('text')).toBeInTheDocument();
        });
    });

    describe('tooltip display on hover', (): void => {
        it('shows tooltip on hover for hover-capable pointers', async (): Promise<void> => {
            const user = userEvent.setup();
            vi.spyOn(window, 'matchMedia').mockImplementation(
                () => ({ matches: true }) as MediaQueryList
            );

            renderWithTheme(<TextWithTooltip text="Hover me" tooltipContent="Tooltip content" />);

            const text = screen.getByText('Hover me');
            await user.hover(text);

            expect(screen.getByRole('tooltip')).toHaveTextContent('Tooltip content');
        });

        it('hides tooltip on unhover', async (): Promise<void> => {
            const user = userEvent.setup();
            vi.spyOn(window, 'matchMedia').mockImplementation(
                () => ({ matches: true }) as MediaQueryList
            );

            renderWithTheme(<TextWithTooltip text="Text" tooltipContent="Tooltip" />);

            const text = screen.getByText('Text');
            await user.hover(text);
            expect(screen.getByRole('tooltip')).toBeInTheDocument();

            await user.unhover(text);
            expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        });
    });

    describe('tooltip display on touch/tap', (): void => {
        it('shows tooltip on click for touch mode', async (): Promise<void> => {
            const user = userEvent.setup();
            vi.spyOn(window, 'matchMedia').mockImplementation(
                () => ({ matches: false }) as MediaQueryList
            );

            renderWithTheme(<TextWithTooltip text="Tap me" tooltipContent="Tooltip" />);

            await user.click(screen.getByText('Tap me'));

            expect(screen.getByRole('tooltip')).toHaveTextContent('Tooltip');
        });

        it('toggles tooltip on multiple taps', async (): Promise<void> => {
            const user = userEvent.setup();
            vi.spyOn(window, 'matchMedia').mockImplementation(
                () => ({ matches: false }) as MediaQueryList
            );

            renderWithTheme(<TextWithTooltip text="Text" tooltipContent="Tip" />);

            const text = screen.getByText('Text');

            await user.click(text);
            expect(screen.getByRole('tooltip')).toBeInTheDocument();

            await user.click(text);
            expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        });

        it('closes tooltip on Escape key', async (): Promise<void> => {
            const user = userEvent.setup();
            vi.spyOn(window, 'matchMedia').mockImplementation(
                () => ({ matches: false }) as MediaQueryList
            );

            renderWithTheme(<TextWithTooltip text="Text" tooltipContent="Tooltip" />);

            await user.click(screen.getByText('Text'));
            expect(screen.getByRole('tooltip')).toBeInTheDocument();

            await user.keyboard('{Escape}');
            expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        });
    });

    describe('tooltip content', (): void => {
        it('renders tooltip with text content', async (): Promise<void> => {
            const user = userEvent.setup();
            vi.spyOn(window, 'matchMedia').mockImplementation(
                () => ({ matches: true }) as MediaQueryList
            );

            renderWithTheme(<TextWithTooltip text="Text" tooltipContent="Tooltip hint text" />);

            await user.hover(screen.getByText('Text'));

            expect(screen.getByRole('tooltip')).toHaveTextContent('Tooltip hint text');
        });

        it('renders tooltip with complex content', async (): Promise<void> => {
            const user = userEvent.setup();
            vi.spyOn(window, 'matchMedia').mockImplementation(
                () => ({ matches: true }) as MediaQueryList
            );

            renderWithTheme(
                <TextWithTooltip
                    text="Text"
                    tooltipContent={
                        <div>
                            <p>Line 1</p>
                            <p>Line 2</p>
                        </div>
                    }
                />
            );

            await user.hover(screen.getByText('Text'));

            const tooltip = screen.getByRole('tooltip');
            expect(tooltip).toHaveTextContent('Line 1');
            expect(tooltip).toHaveTextContent('Line 2');
        });
    });

    describe('custom width', (): void => {
        it('accepts custom width prop', async (): Promise<void> => {
            vi.spyOn(window, 'matchMedia').mockImplementation(
                () => ({ matches: true }) as MediaQueryList
            );

            const user = userEvent.setup();
            renderWithTheme(<TextWithTooltip text="Text" tooltipContent="Tooltip" width={300} />);

            expect(screen.getByText('Text')).toBeInTheDocument();
            await user.hover(screen.getByText('Text'));
            const tooltip = await screen.findByRole('tooltip');
            expect(tooltip).toBeInTheDocument();
            expect(tooltip).toHaveStyle({ width: '300px' });
        });

        it('uses default width when not provided', async (): Promise<void> => {
            vi.spyOn(window, 'matchMedia').mockImplementation(
                () => ({ matches: true }) as MediaQueryList
            );

            const user = userEvent.setup();
            renderWithTheme(<TextWithTooltip text="Text" tooltipContent="Tooltip" />);

            expect(screen.getByText('Text')).toBeInTheDocument();
            await user.hover(screen.getByText('Text'));
            const tooltip = await screen.findByRole('tooltip');
            expect(tooltip).toBeInTheDocument();
            expect(tooltip).toHaveStyle({ width: DEFAULT_WIDTH + 'px' });
        });
    });

    describe('enableTapOnTouch', (): void => {
        it('enables tap on touch by default', async (): Promise<void> => {
            const user = userEvent.setup();
            vi.spyOn(window, 'matchMedia').mockImplementation(
                () => ({ matches: false }) as MediaQueryList
            );

            renderWithTheme(<TextWithTooltip text="Text" tooltipContent="Tooltip" />);

            await user.click(screen.getByText('Text'));
            expect(screen.getByRole('tooltip')).toBeInTheDocument();
        });
    });
});
