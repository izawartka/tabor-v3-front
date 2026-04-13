import { useEffect, useId, useState } from 'react';
import type { JSX } from 'react';
import styled, { useTheme } from 'styled-components';
import {
    TOP_NAV_DRAWER_ARIA_LABEL,
    TOP_NAV_MENU_CLOSE_LABEL,
    TOP_NAV_MENU_OPEN_LABEL
} from './TopNav.constants';
import { TopNavTabList } from './TopNavTabList';
import { MobileTopNavActions } from './MobileTopNavActions';
import { BarsIcon } from '../../icons/BarsIcon';
import { LeftArrowIcon } from '../../icons/LeftArrowIcon';
import { TopNavToggle } from './TopNavToggle';

export interface MobileTopNavDrawerProps {
    pathname: string;
}

const StyledBackdrop = styled.button<{ $open: boolean }>`
    position: fixed;
    inset: 0;
    border: 0;
    padding: 0;
    background: ${({ theme }): string => theme.colors.overlay};
    opacity: ${({ $open }): number => ($open ? 1 : 0)};
    pointer-events: ${({ $open }): string => ($open ? 'auto' : 'none')};
    transition: opacity 0.18s ease;
    z-index: 10;
`;

const StyledDrawer = styled.aside<{ $open: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    width: min(320px, 100%);
    height: 100dvh;
    background: ${({ theme }): string => theme.colors.surface};
    border-right: 1px solid ${({ theme }): string => theme.colors.border};
    transform: ${({ $open }): string => ($open ? 'translateX(0)' : 'translateX(-101%)')};
    transition: transform 0.2s ease;
    z-index: 11;
    padding: 16px 12px;
    display: flex;
    flex-direction: column;
    gap: 18px;
`;

export const MobileTopNavDrawer = ({ pathname }: MobileTopNavDrawerProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const drawerId = useId();
    const theme = useTheme();

    useEffect((): (() => void) => {
        const onKeyDown = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return (): void => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    const openDrawer = (): void => {
        setIsOpen(true);
    };

    const closeDrawer = (): void => {
        setIsOpen(false);
    };

    return (
        <>
            <TopNavToggle
                icon={<BarsIcon color={theme.colors.text} />}
                onClick={isOpen ? closeDrawer : openDrawer}
                isOn={isOpen}
                ariaLabel={isOpen ? TOP_NAV_MENU_CLOSE_LABEL : TOP_NAV_MENU_OPEN_LABEL}
                label={isOpen ? TOP_NAV_MENU_CLOSE_LABEL : TOP_NAV_MENU_OPEN_LABEL}
            />
            <StyledBackdrop
                type="button"
                $open={isOpen}
                onClick={closeDrawer}
                aria-label={TOP_NAV_MENU_CLOSE_LABEL}
            />
            <StyledDrawer
                id={drawerId}
                $open={isOpen}
                aria-label={TOP_NAV_DRAWER_ARIA_LABEL}
                aria-hidden={!isOpen}
            >
                <TopNavToggle
                    icon={<LeftArrowIcon color={theme.colors.text} />}
                    onClick={closeDrawer}
                    isOn={false}
                    ariaLabel={TOP_NAV_MENU_CLOSE_LABEL}
                    label={TOP_NAV_MENU_CLOSE_LABEL}
                    showLabel={true}
                />
                <TopNavTabList
                    pathname={pathname}
                    orientation="vertical"
                    onTabClick={closeDrawer}
                    ariaLabel={TOP_NAV_DRAWER_ARIA_LABEL}
                />
                <MobileTopNavActions />
            </StyledDrawer>
        </>
    );
};
