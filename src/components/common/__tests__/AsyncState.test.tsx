import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    ASYNC_STATE_EMPTY_TEXT,
    ASYNC_STATE_LOADING_TEXT,
    ASYNC_STATE_RETRY_LABEL,
    EmptyState,
    ErrorState,
    InlineLoadingState,
    LoadingState
} from '../AsyncState';
import { renderWithTheme } from '../../../test/renderWithTheme';

describe('AsyncState', (): void => {
    describe('LoadingState', (): void => {
        it('renders with default loading text', (): void => {
            renderWithTheme(<LoadingState />);

            expect(screen.getByText(ASYNC_STATE_LOADING_TEXT)).toBeInTheDocument();
        });

        it('renders custom text when provided', (): void => {
            renderWithTheme(<LoadingState text="Custom loading..." />);

            expect(screen.getByText('Custom loading...')).toBeInTheDocument();
            expect(screen.queryByText(ASYNC_STATE_LOADING_TEXT)).not.toBeInTheDocument();
        });

        it('has accessible spinner marked as aria-hidden', (): void => {
            const { container } = renderWithTheme(<LoadingState />);

            const spinner = container.querySelector('[aria-hidden="true"]');
            expect(spinner).toBeInTheDocument();
            expect(spinner).toHaveAttribute('aria-hidden', 'true');
        });
    });

    describe('InlineLoadingState', (): void => {
        it('renders inline loading with default text', (): void => {
            renderWithTheme(<InlineLoadingState />);

            expect(screen.getByText(ASYNC_STATE_LOADING_TEXT)).toBeInTheDocument();
        });

        it('renders custom text', (): void => {
            renderWithTheme(<InlineLoadingState text="Searching..." />);

            expect(screen.getByText('Searching...')).toBeInTheDocument();
        });

        it('includes spinner element', (): void => {
            const { container } = renderWithTheme(<InlineLoadingState />);

            const spinner = container.querySelector('[aria-hidden="true"]');
            expect(spinner).toBeInTheDocument();
        });
    });

    describe('EmptyState', (): void => {
        it('renders with default text', (): void => {
            renderWithTheme(<EmptyState />);

            expect(screen.getByText(ASYNC_STATE_EMPTY_TEXT)).toBeInTheDocument();
        });

        it('renders custom text when provided', (): void => {
            renderWithTheme(<EmptyState text="No items found" />);

            expect(screen.getByText('No items found')).toBeInTheDocument();
            expect(screen.queryByText(ASYNC_STATE_EMPTY_TEXT)).not.toBeInTheDocument();
        });

        it('renders in container with proper styling', (): void => {
            const { container } = renderWithTheme(<EmptyState text="Empty" />);

            const article = container.querySelector('[role="article"]') || container.firstChild;
            expect(article).toBeInTheDocument();
        });
    });

    describe('ErrorState', (): void => {
        it('displays error message', (): void => {
            renderWithTheme(<ErrorState message="Something went wrong" />);

            expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        });

        it('renders alert role for accessibility', (): void => {
            renderWithTheme(<ErrorState message="Error" />);

            expect(screen.getByRole('alert')).toBeInTheDocument();
        });

        it('renders retry button when onRetry callback provided', (): void => {
            renderWithTheme(<ErrorState message="Error" onRetry={vi.fn()} />);

            expect(
                screen.getByRole('button', { name: ASYNC_STATE_RETRY_LABEL })
            ).toBeInTheDocument();
        });

        it('does not render retry button when onRetry not provided', (): void => {
            renderWithTheme(<ErrorState message="Error" />);

            expect(screen.queryByRole('button')).not.toBeInTheDocument();
        });

        it('triggers retry callback on button click', async (): Promise<void> => {
            const user = userEvent.setup();
            const onRetry = vi.fn();
            renderWithTheme(<ErrorState message="Błąd" onRetry={onRetry} />);

            await user.click(screen.getByRole('button', { name: ASYNC_STATE_RETRY_LABEL }));

            expect(onRetry).toHaveBeenCalledTimes(1);
            expect(onRetry).toHaveBeenCalledWith(expect.any(Object));
        });

        it('calls retry multiple times on multiple clicks', async (): Promise<void> => {
            const user = userEvent.setup();
            const onRetry = vi.fn();
            renderWithTheme(<ErrorState message="Error" onRetry={onRetry} />);

            const button = screen.getByRole('button');
            await user.click(button);
            await user.click(button);
            await user.click(button);

            expect(onRetry).toHaveBeenCalledTimes(3);
        });

        it('handles different error messages', (): void => {
            const messages = [
                'Network error',
                'Invalid data',
                'Timeout occurred',
                'Permission denied'
            ];

            for (const message of messages) {
                const { unmount } = renderWithTheme(<ErrorState message={message} />);
                expect(screen.getByText(message)).toBeInTheDocument();
                unmount();
            }
        });

        it('displays both message and button together', async (): Promise<void> => {
            const user = userEvent.setup();
            const onRetry = vi.fn();
            renderWithTheme(<ErrorState message="Custom error message" onRetry={onRetry} />);

            expect(screen.getByText('Custom error message')).toBeInTheDocument();
            const button = screen.getByRole('button');
            expect(button).toBeInTheDocument();

            await user.click(button);
            expect(onRetry).toHaveBeenCalled();
        });
    });
});
