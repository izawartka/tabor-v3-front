import { useContext } from 'react';
import { PrivateModeContext, type PrivateModeContextValue } from './privateModeStore';

export const usePrivateMode = (): PrivateModeContextValue => {
    const context = useContext(PrivateModeContext);

    if (!context) {
        throw new Error('usePrivateMode must be used inside PrivateModeProvider');
    }

    return context;
};
