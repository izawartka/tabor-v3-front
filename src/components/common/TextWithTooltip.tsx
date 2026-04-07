import type { JSX } from 'react';
import styled from 'styled-components';
import { HoverTooltip } from './HoverTooltip';

const Text = styled.span`
    text-decoration-line: underline;
    text-decoration-style: dotted;
    text-underline-offset: 2px;
    cursor: help;
`;

interface TextWithTooltip {
    text: React.ReactNode;
    tooltipContent: React.ReactNode;
    width?: number;
}

export const TextWithTooltip = ({ text, tooltipContent, width }: TextWithTooltip): JSX.Element => (
    <HoverTooltip content={tooltipContent} width={width} enableTapOnTouch>
        <Text>{text}</Text>
    </HoverTooltip>
);
