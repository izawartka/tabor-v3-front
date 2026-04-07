import type { JSX } from 'react';
import { EmptyState } from '../components/common/AsyncState';

export const NOT_FOUND_PAGE_TEXT = 'Nie znaleziono strony.';

export const NotFoundPage = (): JSX.Element => <EmptyState text={NOT_FOUND_PAGE_TEXT} />;
