import type { JSX } from 'react';
import styled from 'styled-components';
import { HoverTooltip } from './HoverTooltip';
import type { ApiReference } from '../../types/api';
import { ProgressivePhoto } from './ProgressivePhoto';

const Hint = styled.p`
    margin: 8px 0 0;
    font-size: 0.85rem;
    color: ${({ theme }): string => theme.colors.secondaryText};
`;

export interface ReferenceTooltipProps {
    children: React.ReactNode;
    reference: ApiReference;
    hintText?: string;
}

export const ReferenceTooltip = ({
    children,
    reference,
    hintText
}: ReferenceTooltipProps): JSX.Element => {
    return (
        <HoverTooltip
            content={
                <>
                    <ProgressivePhoto photoId={reference.thumb} alt="Miniatura" />
                    <Hint>{hintText}</Hint>
                </>
            }
        >
            {children}
        </HoverTooltip>
    );
};
