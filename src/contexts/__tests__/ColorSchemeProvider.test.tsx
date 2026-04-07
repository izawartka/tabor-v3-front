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
});
