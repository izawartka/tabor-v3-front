import type { JSX } from 'react';
import styled from 'styled-components';
import { TextWithTooltip } from '../common/TextWithTooltip';

const Item = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
`;

const Label = styled.div`
    color: ${({ theme }): string => theme.colors.text};
`;

export interface EventPropertyLabelProps {
    text: string;
    tooltip?: React.ReactNode;
    children?: React.ReactNode;
}

export const EventPropertyLabel = ({
    text,
    tooltip,
    children
}: EventPropertyLabelProps): JSX.Element => {
    return (
        <Item>
            <Label>
                {tooltip ? <TextWithTooltip text={text} tooltipContent={tooltip} /> : text}
            </Label>
            {children}
        </Item>
    );
};
