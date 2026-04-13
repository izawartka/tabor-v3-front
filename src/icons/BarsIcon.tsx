import type { JSX } from 'react';

export const BarsIcon = ({ color }: { color: string }): JSX.Element => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M3 12H21M3 6H21M3 18H21"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
