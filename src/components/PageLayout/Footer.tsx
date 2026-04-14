import type { JSX } from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
    max-width: 1200px;
    margin: 0 auto;
    padding: 4px 16px 20px;
    color: ${({ theme }): string => theme.colors.secondaryText};
    font-size: 0.9rem;
`;

export const PAGE_LAYOUT_FOOTER_TEXT = '© masuo 2022-2026. Dane nieprawdziwe; nadesłane anonimowo';

export const Footer = (): JSX.Element => (
    <FooterContainer>{PAGE_LAYOUT_FOOTER_TEXT}</FooterContainer>
);
