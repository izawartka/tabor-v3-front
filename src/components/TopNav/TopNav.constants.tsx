export const TOP_NAV_LABEL = 'Pokaż:';
export const TOP_NAV_ARIA_LABEL = 'Główna nawigacja';
export const TOP_NAV_DARK_MODE_LABEL = 'Włącz tryb jasny';
export const TOP_NAV_LIGHT_MODE_LABEL = 'Włącz tryb ciemny';

export const TOP_NAV_TABS = [
    { label: 'Według typów', to: '/types', activePaths: ['/', '/types', '/type', '/loco'] },
    { label: 'Według dat', to: '/years', activePaths: ['/years', '/year', '/date'] },
    { label: 'Według miejsc', to: '/places', activePaths: ['/places', '/place'] },
    { label: 'Dobre', to: '/fav', activePaths: ['/fav'] }
] as const;
