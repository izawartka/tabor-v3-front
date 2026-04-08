import { screen } from '@testing-library/react';
import { EventList } from '../EventList';
import { renderWithTheme } from '../../../test/renderWithTheme';
import { createMergedEvent, createSubevent } from '../../../test/factories/api';

describe('EventList', (): void => {
    it('renders empty container when event list is empty', (): void => {
        const { container } = renderWithTheme(<EventList events={[]} />);

        expect(container.querySelectorAll('article')).toHaveLength(0);
    });

    it('renders all events', (): void => {
        renderWithTheme(<EventList events={[createMergedEvent(), createMergedEvent()]} />);

        expect(screen.getAllByText('Oznaczenie')).toHaveLength(2);
    });

    it('renders one card per event', (): void => {
        renderWithTheme(
            <EventList events={[createMergedEvent(), createMergedEvent(), createMergedEvent()]} />
        );

        expect(screen.getAllByRole('article')).toHaveLength(3);
    });

    it('renders event-specific data for each item', (): void => {
        renderWithTheme(
            <EventList
                events={[
                    createMergedEvent({
                        common: {
                            media: { photo: null, photo_fav: false, video: null, video_fav: false },
                            time: {
                                text: '2024.01.01 08:00',
                                date: '2024.01.01',
                                year: '2024',
                                timestamp: 1
                            }
                        },
                        subevents: [
                            createSubevent({
                                loco: {
                                    type: 's',
                                    id: '1',
                                    sort: '1',
                                    series_no: 'S1',
                                    class_no: 'EU07-001'
                                }
                            })
                        ]
                    }),
                    createMergedEvent({
                        common: {
                            media: { photo: null, photo_fav: false, video: null, video_fav: false },
                            time: {
                                text: '2024.01.02 09:00',
                                date: '2024.01.02',
                                year: '2024',
                                timestamp: 2
                            }
                        },
                        subevents: [
                            createSubevent({
                                loco: {
                                    type: 's',
                                    id: '2',
                                    sort: '2',
                                    series_no: 'S2',
                                    class_no: 'EU07-002'
                                }
                            })
                        ]
                    })
                ]}
            />
        );

        expect(screen.getByText('2024.01.01 08:00')).toBeInTheDocument();
        expect(screen.getByText('2024.01.02 09:00')).toBeInTheDocument();
        expect(screen.getByText('EU07-001')).toBeInTheDocument();
        expect(screen.getByText('EU07-002')).toBeInTheDocument();
    });
});
