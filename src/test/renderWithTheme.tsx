import { render } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ColorSchemeContext } from '../contexts/colorSchemeStore';
import { darkTheme } from '../styles/theme';

export const TEST_DEFAULT_ROUTE = '/';
export const TEST_DEFAULT_SCHEME = 'dark';

export const renderWithTheme = (
    ui: ReactElement,
    route = TEST_DEFAULT_ROUTE
): RenderResult<
    typeof import('D:/Programowanie/tabor3/node_modules/@testing-library/dom/types/queries'),
    HTMLElement,
    HTMLElement
> =>
    render(
        <ColorSchemeContext.Provider value={{ scheme: TEST_DEFAULT_SCHEME, toggleScheme: vi.fn() }}>
            <ThemeProvider theme={darkTheme}>
                <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
            </ThemeProvider>
        </ColorSchemeContext.Provider>
    );
