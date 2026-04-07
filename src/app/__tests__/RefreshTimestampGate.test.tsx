import { screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { RefreshTimestampGate } from '../RefreshTimestampGate';
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
});
