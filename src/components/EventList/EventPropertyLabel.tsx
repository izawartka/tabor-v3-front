import type { JSX } from 'react';
import styled from 'styled-components';
import { TextWithTooltip } from '../common/TextWithTooltip';

const StyledCont = styled.div`
    display: flex;
    gap: 8px;
    align-items: flex-start;
`;

const StyledLabel = styled.div`
    color: ${({ theme }): string => theme.colors.text};
    padding-top: 1px;
    flex: 0 0 auto;
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
        <StyledCont>
            <StyledLabel>
                {tooltip ? <TextWithTooltip text={text} tooltipContent={tooltip} /> : text}
            </StyledLabel>
            {children}
        </StyledCont>
    );
};
