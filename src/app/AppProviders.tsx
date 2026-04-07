import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ColorSchemeProvider } from '../contexts/ColorSchemeProvider';
import { RefreshTimestampProvider } from '../contexts/RefreshTimestampContext';
import { useColorScheme } from '../contexts/useColorScheme';
import { GlobalStyles } from '../styles/GlobalStyles';
import { darkTheme, lightTheme } from '../styles/theme';
import type { JSX } from 'react';

const ThemedApp = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const { scheme } = useColorScheme();
    const activeTheme = scheme === 'dark' ? darkTheme : lightTheme;
    const routerBasename = import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL;

    return (
        <ThemeProvider theme={activeTheme}>
            <GlobalStyles />
            <BrowserRouter basename={routerBasename}>
                <RefreshTimestampProvider>{children}</RefreshTimestampProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
};

export const AppProviders = ({ children }: { children: React.ReactNode }): JSX.Element => (
    <ColorSchemeProvider>
        <ThemedApp>{children}</ThemedApp>
    </ColorSchemeProvider>
);
