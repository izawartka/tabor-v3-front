import { useCallback, useEffect, useRef, useState } from 'react';
import type { JSX } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

export const DEFAULT_WIDTH = 220;

const Layer = styled.div<{ $top: number; $left: number; $width: number }>`
    position: fixed;
    top: ${({ $top }): string => `${$top}px`};
    left: ${({ $left }): string => `${$left}px`};
    width: ${({ $width }): string => `${$width}px`};
    z-index: 2147483647;
    background: ${({ theme }): string => theme.colors.surface};
    border: 1px solid ${({ theme }): string => theme.colors.border};
    border-radius: ${({ theme }): string => theme.radii.lg};
    padding: 8px;
    box-shadow: ${({ theme }): string => theme.shadow};
    pointer-events: none;
`;

const canHover = (): boolean =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const calculatePosition = (
    anchorRect: DOMRect,
    tooltipHeight: number,
    tooltipWidth: number
): { top: number; left: number } => {
    const offset = 10;
    const viewportMargin = 8;

    const maxLeft = window.innerWidth - tooltipWidth - viewportMargin;
    const left = Math.max(viewportMargin, Math.min(anchorRect.left, maxLeft));

    const bottomTop = anchorRect.bottom + offset;
    const fitsBottom = bottomTop + tooltipHeight <= window.innerHeight - viewportMargin;

    if (fitsBottom) {
        return { top: bottomTop, left };
    }

    const top = Math.max(viewportMargin, anchorRect.top - tooltipHeight - offset);
    return { top, left };
};

interface HoverTooltipProps {
    children: React.ReactNode;
    content: React.ReactNode;
    width?: number;
    enableTapOnTouch?: boolean;
}

export const HoverTooltip = ({
    children,
    content,
    width = DEFAULT_WIDTH,
    enableTapOnTouch = false
}: HoverTooltipProps): JSX.Element => {
    const anchorRef = useRef<HTMLDivElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    const updatePosition = useCallback((): void => {
        if (!anchorRef.current) {
            return;
        }

        setPosition(
            calculatePosition(
                anchorRef.current.getBoundingClientRect(),
                tooltipRef.current?.offsetHeight || 160,
                width
            )
        );
    }, [width]);

    useEffect((): (() => void) => {
        if (isOpen) {
            updatePosition();
        }

        const handle = (): void => updatePosition();

        window.addEventListener('resize', handle);
        window.addEventListener('scroll', handle, true);

        return (): void => {
            window.removeEventListener('resize', handle);
            window.removeEventListener('scroll', handle, true);
        };
    }, [isOpen, updatePosition]);

    useEffect((): (() => void) | undefined => {
        if (!isOpen || !enableTapOnTouch || canHover()) {
            return;
        }

        const onPointerDown = (event: PointerEvent): void => {
            const target = event.target;

            if (
                target instanceof Node &&
                (anchorRef.current?.contains(target) || tooltipRef.current?.contains(target))
            ) {
                return;
            }

            setIsOpen(false);
        };

        const onEsc = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('keydown', onEsc);

        return (): void => {
            window.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('keydown', onEsc);
        };
    }, [isOpen, enableTapOnTouch]);

    const open = (): void => {
        if (!canHover()) {
            return;
        }

        updatePosition();
        setIsOpen(true);
    };

    const close = (): void => {
        if (!canHover()) {
            return;
        }

        setIsOpen(false);
    };

    const toggleTap = (): void => {
        if (!enableTapOnTouch || canHover()) {
            return;
        }

        updatePosition();
        setIsOpen(value => !value);
    };

    return (
        <div ref={anchorRef} onMouseEnter={open} onMouseLeave={close} onClick={toggleTap}>
            {children}
            {isOpen
                ? createPortal(
                      <Layer
                          ref={tooltipRef}
                          role="tooltip"
                          $top={position.top}
                          $left={position.left}
                          $width={width}
                      >
                          {content}
                      </Layer>,
                      document.body
                  )
                : null}
        </div>
    );
};
