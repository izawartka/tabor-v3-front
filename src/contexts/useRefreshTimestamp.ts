import { useContext } from 'react';
import {
    RefreshTimestampContext,
    type RefreshTimestampContextValue
} from './refreshTimestampStore';

export const useRefreshTimestamp = (): RefreshTimestampContextValue => {
    const context = useContext(RefreshTimestampContext);

    if (!context) {
        throw new Error('useRefreshTimestamp must be used inside RefreshTimestampProvider');
    }

    return context;
};
