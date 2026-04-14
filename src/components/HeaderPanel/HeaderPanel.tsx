import type { JSX } from 'react';
import styled from 'styled-components';
import { HeaderProperty, type HeaderPropertyProps } from './HeaderProperty';

export const HEADER_PANEL_COLUMNS_COUNT = 3;

const StyledPanel = styled.section`
    background: ${({ theme }): string => theme.colors.surface};
    border: 1px solid ${({ theme }): string => theme.colors.border};
    border-radius: ${({ theme }): string => theme.radii.lg};
    padding: 14px;
    margin-bottom: 16px;
`;

const StyledTitle = styled.h1`
    margin: 0 2px 12px;
    font-size: 1.4rem;
`;

const StyledPropertyList = styled.dl`
    margin: 0;
    display: grid;
    grid-template-columns: repeat(${HEADER_PANEL_COLUMNS_COUNT}, minmax(0, 1fr));
    gap: 10px;

    @media (max-width: ${({ theme }): number => theme.breakpoints.mobile}px) {
        grid-template-columns: 1fr;
    }
`;

export const HeaderPanel = ({
    title,
    properties
}: {
    title: string;
    properties: HeaderPropertyProps[];
}): JSX.Element => (
    <StyledPanel>
        <StyledTitle>{title}</StyledTitle>
        <StyledPropertyList>
            {properties.map(
                (prop, index): JSX.Element => (
                    <HeaderProperty key={index} {...prop} />
                )
            )}
        </StyledPropertyList>
    </StyledPanel>
);
