import type { JSX } from 'react';
import styled from 'styled-components';
import { ReferenceTooltip } from '../common/ReferenceTooltip';
import type { ApiReference } from '../../types/api';
import { Link } from 'react-router-dom';

const StyledValue = styled.div`
    background: ${({ theme }): string => theme.colors.surfaceAlt};
    padding: 1px 10px;
    border-radius: 12px;
    font-weight: 600;
    line-height: 1.35;
    display: flex;
    align-items: center;
    gap: 6px;
`;

const StyledLinkValue = styled(Link)`
    background: ${({ theme }): string => theme.colors.accentSoft};
    padding: 1px 10px;
    border-radius: 12px;
    font-weight: 600;
    line-height: 1.35;
    display: flex;
    align-items: center;
    gap: 6px;

    text-decoration: none;
`;

const StyledRefEventCount = styled.span`
    font-size: 0.7em;
    color: ${({ theme }): string => theme.colors.muted};
`;

export interface EventPropertyValueRefData {
    ref: ApiReference;
    href: string;
    refText?: string;
}

export interface EventPropertyValueProps {
    text?: string;
    refData?: EventPropertyValueRefData;
}

export const EventPropertyValue = ({ text, refData }: EventPropertyValueProps): JSX.Element => {
    if (!text) {
        return <StyledValue>-</StyledValue>;
    }

    if (!refData) {
        return <StyledValue>{text}</StyledValue>;
    }

    return (
        <ReferenceTooltip reference={refData.ref} hintText={refData.refText}>
            <StyledLinkValue to={refData.href}>
                {text} <StyledRefEventCount>({refData.ref.event_count})</StyledRefEventCount>
            </StyledLinkValue>
        </ReferenceTooltip>
    );
};
