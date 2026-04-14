import type { JSX } from 'react';
import styled from 'styled-components';
import { ReferenceTooltip } from '../common/ReferenceTooltip';
import type { ApiReference } from '../../types/api';
import { PrefetchedLink } from '../common/PrefetchedLink';

const StyledItemBorder = styled.div<{ $isReference: boolean }>`
    border: 1px solid ${({ theme }): string => theme.colors.border};
    border-radius: ${({ theme }): string => theme.radii.md};
    background: ${({ theme, $isReference }): string =>
        $isReference ? theme.colors.accentSoft : theme.colors.surface};
`;

const StyledItem = styled.div`
    padding: 8px 10px;
    height: stretch;
`;

const StyledLinkItem = styled(PrefetchedLink)`
    display: block;
    padding: 8px 10px;
    text-decoration: none;
    height: stretch;
`;

const StyledLabel = styled.div`
    font-size: 0.82rem;
    color: ${({ theme }): string => theme.colors.muted};
    margin-bottom: 4px;
`;

const StyledValue = styled.div`
    color: ${({ theme }): string => theme.colors.text};
    font-weight: 600;
    line-height: 1.35;
`;

export interface HeaderPropertyValueRefData {
    ref: ApiReference;
    href: string;
    refText?: string;
}

export interface HeaderPropertyProps {
    label: string;
    value?: React.ReactNode;
    reference?: HeaderPropertyValueRefData;
}

export const HeaderProperty = ({
    label,
    value,
    reference
}: HeaderPropertyProps): JSX.Element | null => {
    if (value === undefined || value === null || value === '') {
        return null;
    }

    if (!reference) {
        return (
            <StyledItemBorder $isReference={false}>
                <StyledItem>
                    <StyledLabel>{label}</StyledLabel>
                    <StyledValue>{value}</StyledValue>
                </StyledItem>
            </StyledItemBorder>
        );
    }

    return (
        <StyledItemBorder $isReference={true}>
            <ReferenceTooltip reference={reference.ref} hintText={reference.refText}>
                <StyledLinkItem to={reference.href}>
                    <StyledLabel>{label}</StyledLabel>
                    <StyledValue>{value}</StyledValue>
                </StyledLinkItem>
            </ReferenceTooltip>
        </StyledItemBorder>
    );
};
