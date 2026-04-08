import { screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import {
    REFRESH_TIMESTAMP_GATE_EMPTY_TEXT,
    REFRESH_TIMESTAMP_GATE_LOADING_TEXT,
    RefreshTimestampGate
} from '../RefreshTimestampGate';
import { RefreshTimestampContext } from '../../contexts/refreshTimestampStore';
import { darkTheme } from '../../styles/theme';
import { render } from '@testing-library/react';

describe('RefreshTimestampGate', (): void => {
    it('shows children when timestamp is ready', (): void => {
        render(
            <ThemeProvider theme={darkTheme}>
                <RefreshTimestampContext.Provider
                    value={{
                        refreshTimestamp: '123',
                        isLoading: false,
                        error: null,
                        retry: vi.fn()
                    }}
                >
                    <RefreshTimestampGate>
                        <div>ready</div>
                    </RefreshTimestampGate>
                </RefreshTimestampContext.Provider>
            </ThemeProvider>
        );

        expect(screen.getByText('ready')).toBeInTheDocument();
    });

    it('shows loading and error states', (): void => {
        const retry = vi.fn();

        const { rerender } = render(
            <ThemeProvider theme={darkTheme}>
                <RefreshTimestampContext.Provider
                    value={{ refreshTimestamp: null, isLoading: true, error: null, retry }}
                >
                    <RefreshTimestampGate>
                        <div>ready</div>
                    </RefreshTimestampGate>
                </RefreshTimestampContext.Provider>
            </ThemeProvider>
        );

        expect(screen.getByText(REFRESH_TIMESTAMP_GATE_LOADING_TEXT)).toBeInTheDocument();

        rerender(
            <ThemeProvider theme={darkTheme}>
                <RefreshTimestampContext.Provider
                    value={{ refreshTimestamp: null, isLoading: false, error: 'Błąd', retry }}
                >
                    <RefreshTimestampGate>
                        <div>ready</div>
                    </RefreshTimestampGate>
                </RefreshTimestampContext.Provider>
            </ThemeProvider>
        );

        expect(screen.getByText('Błąd')).toBeInTheDocument();
    });

    it('shows empty timestamp state', (): void => {
        render(
            <ThemeProvider theme={darkTheme}>
                <RefreshTimestampContext.Provider
                    value={{ refreshTimestamp: '', isLoading: false, error: null, retry: vi.fn() }}
                >
                    <RefreshTimestampGate>
                        <div>ready</div>
                    </RefreshTimestampGate>
                </RefreshTimestampContext.Provider>
            </ThemeProvider>
        );

        expect(screen.getByText(REFRESH_TIMESTAMP_GATE_EMPTY_TEXT)).toBeInTheDocument();
    });
});
