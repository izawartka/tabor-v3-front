import type { JSX } from 'react';
import styled from 'styled-components';
import { ReferenceTooltip } from '../common/ReferenceTooltip';
import type { ApiReference } from '../../types/api';
import { Link } from 'react-router-dom';

const Value = styled.div<{ $isRef: boolean }>`
    background: ${({ theme, $isRef }): string =>
        $isRef ? theme.colors.accentSoft : theme.colors.surfaceAlt};
    padding: 1px 10px;
    border-radius: 12px;
    font-weight: 600;
    line-height: 1.35;
    display: flex;
    align-items: center;
    gap: 6px;
`;

const RefEventCount = styled.span`
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
        return <Value $isRef={false}>-</Value>;
    }

    if (!refData) {
        return <Value $isRef={false}>{text}</Value>;
    }

    return (
        <ReferenceTooltip reference={refData.ref} hintText={refData.refText}>
            <Link to={refData.href}>
                <Value $isRef={true}>
                    {text} <RefEventCount>({refData.ref.event_count})</RefEventCount>
                </Value>
            </Link>
        </ReferenceTooltip>
    );
};
