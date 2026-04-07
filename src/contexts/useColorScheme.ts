import { useContext } from 'react';
import { ColorSchemeContext, type ColorSchemeContextValue } from './colorSchemeStore';

export const useColorScheme = (): ColorSchemeContextValue => {
    const context = useContext(ColorSchemeContext);

    if (!context) {
        throw new Error('useColorScheme must be used inside ColorSchemeProvider');
    }

    return context;
};
