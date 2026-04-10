import { act, render, screen } from '@testing-library/react';
import type { JSX } from 'react';
import { PrivateModeProvider } from '../PrivateModeProvider';
import { usePrivateMode } from '../usePrivateMode';
import { DEFAULT_PRIVATE_MODE, PRIVATE_MODE_STORAGE_KEY } from '../privateModeStore';

const Probe = (): JSX.Element => {
    const { privateMode, togglePrivateMode } = usePrivateMode();

    return (
        <div>
            <span>{String(privateMode)}</span>
            <button onClick={togglePrivateMode}>toggle</button>
        </div>
    );
};

describe('PrivateModeProvider', (): void => {
    it('toggles and persists private mode', async (): Promise<void> => {
        window.localStorage.removeItem(PRIVATE_MODE_STORAGE_KEY);

        render(
            <PrivateModeProvider>
                <Probe />
            </PrivateModeProvider>
        );

        expect(screen.getByText(String(DEFAULT_PRIVATE_MODE))).toBeInTheDocument();

        await act(async (): Promise<void> => {
            screen.getByText('toggle').click();
        });

        expect(screen.getByText('true')).toBeInTheDocument();
        expect(window.localStorage.getItem(PRIVATE_MODE_STORAGE_KEY)).toBe('1');
    });
});
