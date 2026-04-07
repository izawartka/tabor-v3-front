import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    margin: 0;
    min-height: 100%;
  }

  body {
    font-family: Inter, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: ${({ theme }): string => theme.colors.bg};
    color: ${({ theme }): string => theme.colors.text};
    color-scheme: ${({ theme }): string => theme.mode};
  }

  button,
  input,
  select,
  textarea {
    color: inherit;
    font: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;
