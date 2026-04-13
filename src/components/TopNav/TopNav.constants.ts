export const TOP_NAV_LABEL = 'Pokaż:';
export const TOP_NAV_ARIA_LABEL = 'Główna nawigacja';
export const TOP_NAV_DRAWER_ARIA_LABEL = 'Menu główne';
export const TOP_NAV_MENU_OPEN_LABEL = 'Otwórz menu';
export const TOP_NAV_MENU_CLOSE_LABEL = 'Zamknij menu';
export const TOP_NAV_SETTINGS_LABEL = 'Ustawienia';

export const TOP_NAV_TABS = [
    { label: 'Według typów', to: '/types', activePaths: ['/', '/types', '/type', '/loco'] },
    { label: 'Według dat', to: '/years', activePaths: ['/years', '/year', '/date'] },
    { label: 'Według miejsc', to: '/places', activePaths: ['/places', '/place'] },
    { label: 'Dobre', to: '/fav', activePaths: ['/fav'] }
] as const;
