import { screen } from '@testing-library/react';
import { EVENT_ITEM_TIME_LABEL, EventView } from '../EventView';
import { renderWithTheme } from '../../../test/renderWithTheme';
import { createMergedEvent, createReference, createSubevent } from '../../../test/factories/api';

describe('EventView', (): void => {
    it('renders time and nested subevents', (): void => {
        renderWithTheme(
            <EventView
                event={createMergedEvent({
                    common: {
                        media: { photo: null, photo_fav: false, video: null, video_fav: false },
                        time: {
                            text: '2025.01.01 10:00',
                            date: '2025.01.01',
                            year: '2025',
                            timestamp: 1,
                            date_ref: createReference({ event_count: 2 })
                        }
                    }
                })}
            />
        );

        expect(screen.getByText(EVENT_ITEM_TIME_LABEL)).toBeInTheDocument();
        expect(screen.getByText('2025.01.01 10:00')).toBeInTheDocument();
        expect(screen.getByText('Oznaczenie')).toBeInTheDocument();
    });

    it('renders multiple subevents', (): void => {
        renderWithTheme(
            <EventView
                event={createMergedEvent({
                    subevents: [
                        createSubevent({
                            loco: {
                                type: 'x',
                                id: '1',
                                sort: '1',
                                series_no: 'S1',
                                class_no: 'EU07-001'
                            }
                        }),
                        createSubevent({
                            loco: {
                                type: 'x',
                                id: '2',
                                sort: '2',
                                series_no: 'S2',
                                class_no: 'EU07-002'
                            }
                        })
                    ]
                })}
            />
        );

        expect(screen.getByText('EU07-001')).toBeInTheDocument();
        expect(screen.getByText('EU07-002')).toBeInTheDocument();
        expect(screen.getAllByText('Oznaczenie')).toHaveLength(2);
    });

    it('renders event without subevents', (): void => {
        renderWithTheme(<EventView event={createMergedEvent({ subevents: [] })} />);

        expect(screen.getByText(EVENT_ITEM_TIME_LABEL)).toBeInTheDocument();
        expect(screen.queryByText('Oznaczenie')).not.toBeInTheDocument();
    });

    it('renders time reference event count when date reference exists', (): void => {
        renderWithTheme(
            <EventView
                event={createMergedEvent({
                    common: {
                        media: { photo: null, photo_fav: false, video: null, video_fav: false },
                        time: {
                            text: '2025.03.15 11:30',
                            date: '2025.03.15',
                            year: '2025',
                            timestamp: 123,
                            date_ref: createReference({ event_count: 9 })
                        }
                    },
                    subevents: []
                })}
            />
        );

        expect(screen.getByText('2025.03.15 11:30')).toBeInTheDocument();
        expect(screen.getByText('(9)')).toBeInTheDocument();
    });
});
