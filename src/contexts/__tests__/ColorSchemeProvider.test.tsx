import { act, render, screen } from '@testing-library/react';
import type { JSX } from 'react';
import { ColorSchemeProvider } from '../ColorSchemeProvider';
import { useColorScheme } from '../useColorScheme';
import {
    COLOR_SCHEME_STORAGE_KEY,
    DEFAULT_COLOR_SCHEME,
    LIGHT_COLOR_SCHEME
} from '../colorSchemeStore';

const Probe = (): JSX.Element => {
    const { scheme, toggleScheme } = useColorScheme();

    return (
        <div>
            <span>{scheme}</span>
            <button onClick={toggleScheme}>toggle</button>
        </div>
    );
};

describe('ColorSchemeProvider', (): void => {
    beforeEach((): void => {
        window.localStorage.clear();
    });

    it('toggles and persists scheme', async (): Promise<void> => {
        window.localStorage.removeItem(COLOR_SCHEME_STORAGE_KEY);

        render(
            <ColorSchemeProvider>
                <Probe />
            </ColorSchemeProvider>
        );

        expect(screen.getByText(DEFAULT_COLOR_SCHEME)).toBeInTheDocument();

        await act(async (): Promise<void> => {
            screen.getByText('toggle').click();
        });

        expect(screen.getByText(LIGHT_COLOR_SCHEME)).toBeInTheDocument();
        expect(window.localStorage.getItem(COLOR_SCHEME_STORAGE_KEY)).toBe(LIGHT_COLOR_SCHEME);
    });

    it('reads initial scheme from localStorage when value is valid', (): void => {
        window.localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, LIGHT_COLOR_SCHEME);

        render(
            <ColorSchemeProvider>
                <Probe />
            </ColorSchemeProvider>
        );

        expect(screen.getByText(LIGHT_COLOR_SCHEME)).toBeInTheDocument();
    });

    it('falls back to default scheme for invalid localStorage value', (): void => {
        window.localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, 'sepia');

        render(
            <ColorSchemeProvider>
                <Probe />
            </ColorSchemeProvider>
        );

        expect(screen.getByText(DEFAULT_COLOR_SCHEME)).toBeInTheDocument();
    });

    it('toggles both directions and persists final value', async (): Promise<void> => {
        render(
            <ColorSchemeProvider>
                <Probe />
            </ColorSchemeProvider>
        );

        await act(async (): Promise<void> => {
            screen.getByText('toggle').click();
            screen.getByText('toggle').click();
        });

        expect(screen.getByText(DEFAULT_COLOR_SCHEME)).toBeInTheDocument();
        expect(window.localStorage.getItem(COLOR_SCHEME_STORAGE_KEY)).toBe(DEFAULT_COLOR_SCHEME);
    });
});
