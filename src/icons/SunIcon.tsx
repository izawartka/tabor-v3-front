import type { JSX } from 'react';

export const SunIcon = ({ color }: { color: string }): JSX.Element => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="2" />
        <path
            d="M12 2V5M12 19V22M22 12H19M5 12H2M19.07 4.93L16.95 7.05M7.05 16.95L4.93 19.07M19.07 19.07L16.95 16.95M7.05 7.05L4.93 4.93"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);
