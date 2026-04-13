import type { JSX } from 'react';
import { useTheme } from 'styled-components';
import { usePrivateMode } from '../../contexts/usePrivateMode';
import {
    TOP_NAV_PRIVATE_MODE_OFF_LABEL,
    TOP_NAV_PRIVATE_MODE_ON_LABEL
} from './PrivateModeToggle.constants';
import { InfoIcon } from '../../icons/InfoIcon';
import { TopNavToggle } from './TopNavToggle';

export interface PrivateModeToggleProps {
    showLabel?: boolean;
}

export const PrivateModeToggle = ({ showLabel = false }: PrivateModeToggleProps): JSX.Element => {
    const { privateMode, togglePrivateMode } = usePrivateMode();
    const theme = useTheme();
    const icon = <InfoIcon color={theme.colors.text} />;
    const label = privateMode ? TOP_NAV_PRIVATE_MODE_ON_LABEL : TOP_NAV_PRIVATE_MODE_OFF_LABEL;

    return (
        <TopNavToggle
            icon={icon}
            onClick={togglePrivateMode}
            isOn={privateMode}
            ariaLabel={label}
            label={label}
            showLabel={showLabel}
        />
    );
};
