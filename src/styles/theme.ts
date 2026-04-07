const baseTheme = {
    radii: {
        md: '10px',
        lg: '14px'
    },
    breakpoints: {
        mobile: 768,
        tablet: 1024
    }
};

type ThemeMode = 'dark' | 'light';

export interface AppTheme {
    mode: ThemeMode;
    colors: {
        bg: string;
        surface: string;
        surfaceAlt: string;
        border: string;
        text: string;
        secondaryText: string;
        muted: string;
        accent: string;
        accentSoft: string;
        danger: string;
        warning: string;
        mediaFallbackBg: string;
        overlay: string;
    };
    shadow: string;
    radii: {
        md: string;
        lg: string;
    };
    breakpoints: {
        mobile: number;
        tablet: number;
    };
}

export const darkTheme: AppTheme = {
    mode: 'dark',
    colors: {
        bg: '#131313',
        surface: '#1f1f1f',
        surfaceAlt: '#2c2c2c',
        border: '#424242',
        text: '#f5f5f5',
        secondaryText: '#e2e2e2',
        muted: '#b8b8b8',
        accent: '#60a5fa',
        accentSoft: '#60a5fa28',
        danger: '#f87171',
        warning: '#facc15',
        mediaFallbackBg: '#2c2c2c',
        overlay: 'rgba(15, 23, 42, 0.82)'
    },
    shadow: '0 8px 24px rgba(2, 6, 23, 0.45)',
    ...baseTheme
};

export const lightTheme: AppTheme = {
    mode: 'light',
    colors: {
        bg: '#e9e9e9',
        surface: '#f5f5f5',
        surfaceAlt: '#e0e0e0',
        border: '#cbd5e1',
        text: '#111827',
        secondaryText: '#525252',
        muted: '#64748b',
        accent: '#2563eb',
        accentSoft: '#2563eb30',
        danger: '#dc2626',
        warning: '#a16207',
        mediaFallbackBg: '#e2e8f0',
        overlay: 'rgba(231, 231, 231, 0.9)'
    },
    shadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
    ...baseTheme
};
