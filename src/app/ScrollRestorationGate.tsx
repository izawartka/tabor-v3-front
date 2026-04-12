import type { JSX } from 'react';
import { useScrollRestoration } from '../hooks/scroll/useScrollRestoration';

export const ScrollRestorationGate = (): JSX.Element | null => {
    useScrollRestoration();
    return null;
};
