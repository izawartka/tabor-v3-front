import type { JSX } from 'react';
import { useColorScheme } from '../../contexts/useColorScheme';
import { SunIcon } from '../../icons/SunIcon';
import { MoonIcon } from '../../icons/MoonIcon';
import { useTheme } from 'styled-components';
import { TOP_NAV_DARK_MODE_LABEL, TOP_NAV_LIGHT_MODE_LABEL } from './SchemeToggle.constants';
import { TopNavToggle } from './TopNavToggle';

export interface SchemeToggleProps {
    showLabel?: boolean;
}

export const SchemeToggle = ({ showLabel = false }: SchemeToggleProps): JSX.Element => {
    const { scheme, toggleScheme } = useColorScheme();
    const theme = useTheme();
    const icon =
        scheme === 'dark' ? (
            <SunIcon color={theme.colors.text} />
        ) : (
            <MoonIcon color={theme.colors.text} />
        );
    const label = scheme === 'dark' ? TOP_NAV_DARK_MODE_LABEL : TOP_NAV_LIGHT_MODE_LABEL;

    return (
        <TopNavToggle
            icon={icon}
            onClick={toggleScheme}
            isOn={false}
            ariaLabel={label}
            label={label}
            showLabel={showLabel}
        />
    );
};
