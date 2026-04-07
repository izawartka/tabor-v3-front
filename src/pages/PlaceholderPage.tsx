import type { JSX } from 'react';
import { EmptyState } from '../components/common/AsyncState';

export const PLACEHOLDER_EVENT_GROUPS_TEXT = 'Tu pojawi się lista grup eventów.';
export const PLACEHOLDER_EVENT_LIST_TEXT = 'Tu pojawi się lista eventów.';

export const PlaceholderEventGroupsPage = (): JSX.Element => (
    <>
        <EmptyState text={PLACEHOLDER_EVENT_GROUPS_TEXT} />
    </>
);

export const PlaceholderEventListPage = (): JSX.Element => (
    <>
        <EmptyState text={PLACEHOLDER_EVENT_LIST_TEXT} />
    </>
);
