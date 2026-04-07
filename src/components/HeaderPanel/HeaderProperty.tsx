import type { JSX } from 'react';
import styled from 'styled-components';
import { ReferenceTooltip } from '../common/ReferenceTooltip';
import type { ApiReference } from '../../types/api';
import { Link } from 'react-router-dom';

const Item = styled.div<{ $isReference: boolean }>`
    border: 1px solid ${({ theme }): string => theme.colors.border};
    border-radius: ${({ theme }): string => theme.radii.md};
    padding: 8px 10px;
    background: ${({ theme, $isReference }): string =>
        $isReference ? theme.colors.accentSoft : theme.colors.surface};
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    display: block;
`;

const Label = styled.div`
    font-size: 0.82rem;
    color: ${({ theme }): string => theme.colors.muted};
    margin-bottom: 4px;
`;

const Value = styled.div`
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
            <Item $isReference={false}>
                <Label>{label}</Label>
                <Value>{value}</Value>
            </Item>
        );
    }

    return (
        <ReferenceTooltip reference={reference.ref} hintText={reference.refText}>
            <StyledLink to={reference.href}>
                <Item $isReference={true}>
                    <Label>{label}</Label>
                    <Value>{value}</Value>
                </Item>
            </StyledLink>
        </ReferenceTooltip>
    );
};
