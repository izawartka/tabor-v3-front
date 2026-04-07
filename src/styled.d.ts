import 'styled-components';
import type { AppTheme } from './styles/theme';

/* eslint-disable @typescript-eslint/no-empty-object-type */
declare module 'styled-components' {
    export interface DefaultTheme extends AppTheme {}
}
