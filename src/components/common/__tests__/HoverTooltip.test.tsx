import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HoverTooltip } from '../HoverTooltip';
import { renderWithTheme } from '../../../test/renderWithTheme';

describe('HoverTooltip', (): void => {
    beforeEach((): void => {
        vi.restoreAllMocks();
    });

    it('renders children element', (): void => {
        renderWithTheme(
            <HoverTooltip content={<span>Tooltip</span>}>
                <button>Anchor</button>
            </HoverTooltip>
        );

        expect(screen.getByRole('button', { name: 'Anchor' })).toBeInTheDocument();
    });

    it('does not render tooltip initially', (): void => {
        renderWithTheme(
            <HoverTooltip content="Tooltip">
                <button>Button</button>
            </HoverTooltip>
        );

        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('opens on hover for hover-capable pointers', async (): Promise<void> => {
        const user = userEvent.setup();
        vi.spyOn(window, 'matchMedia').mockImplementation(
            () => ({ matches: true }) as MediaQueryList
        );

        renderWithTheme(
            <HoverTooltip content={<span>Hover tooltip</span>}>
                <button>Hover me</button>
            </HoverTooltip>
        );

        await user.hover(screen.getByRole('button'));

        const tooltip = await screen.findByRole('tooltip');
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveTextContent('Hover tooltip');
    });

    it('closes on unhover', async (): Promise<void> => {
        const user = userEvent.setup();
        vi.spyOn(window, 'matchMedia').mockImplementation(
            () => ({ matches: true }) as MediaQueryList
        );

        renderWithTheme(
            <HoverTooltip content="Tooltip">
                <button>Hover</button>
            </HoverTooltip>
        );

        const button = screen.getByRole('button');
        await user.hover(button);

        const tooltip = await screen.findByRole('tooltip');

        expect(tooltip).toBeInTheDocument();

        await user.unhover(button);

        await waitFor(() => {
            expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        });
    });

    it('toggles on click when enableTapOnTouch is true', async (): Promise<void> => {
        const user = userEvent.setup();
        vi.spyOn(window, 'matchMedia').mockImplementation(
            () => ({ matches: false }) as MediaQueryList
        );

        renderWithTheme(
            <HoverTooltip content={<span>Tap tooltip</span>} enableTapOnTouch>
                <button>Tap me</button>
            </HoverTooltip>
        );

        await user.click(screen.getByRole('button'));

        const tooltip = await screen.findByRole('tooltip');

        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveTextContent('Tap tooltip');
    });

    it('closes on Escape in tap mode', async (): Promise<void> => {
        const user = userEvent.setup();
        vi.spyOn(window, 'matchMedia').mockImplementation(
            () => ({ matches: false }) as MediaQueryList
        );

        renderWithTheme(
            <HoverTooltip content="Tooltip" enableTapOnTouch>
                <button>Button</button>
            </HoverTooltip>
        );

        await user.click(screen.getByRole('button'));

        const tooltip = await screen.findByRole('tooltip');
        expect(tooltip).toBeInTheDocument();

        await user.keyboard('{Escape}');

        await waitFor(() => {
            expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        });
    });

    it('accepts custom width prop', async (): Promise<void> => {
        const user = userEvent.setup();
        vi.spyOn(window, 'matchMedia').mockImplementation(
            () => ({ matches: true }) as MediaQueryList
        );
        renderWithTheme(
            <HoverTooltip content="Tooltip" width={300}>
                <button>Button</button>
            </HoverTooltip>
        );

        expect(screen.getByRole('button')).toBeInTheDocument();

        await user.hover(screen.getByRole('button'));
        const tooltip = await screen.findByRole('tooltip');

        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveStyle({ width: '300px' });
    });

    it('renders complex content in tooltip', async (): Promise<void> => {
        const user = userEvent.setup();
        vi.spyOn(window, 'matchMedia').mockImplementation(
            () => ({ matches: true }) as MediaQueryList
        );

        renderWithTheme(
            <HoverTooltip
                content={
                    <div>
                        <strong>Title</strong>
                        <p>Description</p>
                    </div>
                }
            >
                <button>Hover</button>
            </HoverTooltip>
        );

        await user.hover(screen.getByRole('button'));

        const tooltip = await screen.findByRole('tooltip');

        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveTextContent('Title');
        expect(tooltip).toHaveTextContent('Description');
    });

    it('renders text content in tooltip', async (): Promise<void> => {
        const user = userEvent.setup();
        vi.spyOn(window, 'matchMedia').mockImplementation(
            () => ({ matches: true }) as MediaQueryList
        );

        renderWithTheme(
            <HoverTooltip content="Simple text">
                <button>Hover</button>
            </HoverTooltip>
        );

        await user.hover(screen.getByRole('button'));

        const tooltip = await screen.findByRole('tooltip');

        expect(tooltip).toHaveTextContent('Simple text');
    });

    it('renders children with custom content', async (): Promise<void> => {
        const user = userEvent.setup();
        renderWithTheme(
            <HoverTooltip content="Tooltip">
                <span>
                    <strong>Custom</strong>
                </span>
            </HoverTooltip>
        );

        expect(screen.getByText('Custom')).toBeInTheDocument();
        await user.click(screen.getByText('Custom'));

        const tooltip = await screen.findByRole('tooltip');

        expect(tooltip).toBeInTheDocument();
    });

    it('supports styled child anchor and opens tooltip on hover', async (): Promise<void> => {
        const user = userEvent.setup();
        vi.spyOn(window, 'matchMedia').mockImplementation(
            () => ({ matches: true }) as MediaQueryList
        );

        renderWithTheme(
            <HoverTooltip content="Tooltip from child">
                <button className="anchor-button">Anchor child</button>
            </HoverTooltip>
        );

        const anchor = screen.getByRole('button', { name: 'Anchor child' });
        expect(anchor).toHaveClass('anchor-button');

        await user.hover(anchor);
        expect(screen.getByRole('tooltip')).toHaveTextContent('Tooltip from child');
    });

    it('keeps child click handler', async (): Promise<void> => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        vi.spyOn(window, 'matchMedia').mockImplementation(
            () => ({ matches: false }) as MediaQueryList
        );

        renderWithTheme(
            <HoverTooltip content="Tooltip" enableTapOnTouch>
                <button onClick={onClick}>Tap child</button>
            </HoverTooltip>
        );

        await user.click(screen.getByRole('button', { name: 'Tap child' }));

        expect(onClick).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
});
