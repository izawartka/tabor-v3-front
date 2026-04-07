import { createContext } from 'react';

export type ColorScheme = 'dark' | 'light';

export const DEFAULT_COLOR_SCHEME: ColorScheme = 'dark';
export const LIGHT_COLOR_SCHEME: ColorScheme = 'light';
export const COLOR_SCHEME_VALUES = [DEFAULT_COLOR_SCHEME, LIGHT_COLOR_SCHEME] as const;

export interface ColorSchemeContextValue {
    scheme: ColorScheme;
    toggleScheme: () => void;
}

export const ColorSchemeContext = createContext<ColorSchemeContextValue | null>(null);
export const COLOR_SCHEME_STORAGE_KEY = 'tabor3.color-scheme';
