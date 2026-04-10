import { screen } from '@testing-library/react';
import {
    EVENT_ITEM_COMPOSITION_LABEL,
    EVENT_ITEM_DIRECTION_LABEL,
    EVENT_ITEM_EMPTY_COMPOSITION_TEXT,
    EVENT_ITEM_LABEL,
    EVENT_ITEM_PLACE_LABEL,
    SubEventView
} from '../SubEventView';
import { renderWithTheme } from '../../../test/renderWithTheme';
import { createEventPlace, createReference, createSubevent } from '../../../test/factories/api';

vi.mock('../../../contexts/usePrivateMode', () => ({
    usePrivateMode: vi.fn(() => ({ privateMode: false, togglePrivateMode: vi.fn() }))
}));

import { usePrivateMode } from '../../../contexts/usePrivateMode';

describe('SubEventView', (): void => {
    it('renders key event properties', (): void => {
        vi.mocked(usePrivateMode).mockReturnValue({
            privateMode: false,
            togglePrivateMode: vi.fn()
        });

        renderWithTheme(
            <SubEventView
                subEvent={createSubevent({
                    loco: {
                        type: 'dragony',
                        id: 'd6a9d19a',
                        sort: '43',
                        series_no: 'E6ACTadb-series-043',
                        class_no: 'E6ACTadb-043',
                        loco_ref: createReference()
                    }
                })}
            />
        );

        expect(screen.getByText(EVENT_ITEM_LABEL)).toBeInTheDocument();
        expect(screen.getByText(EVENT_ITEM_PLACE_LABEL)).toBeInTheDocument();
        expect(screen.getByText(EVENT_ITEM_DIRECTION_LABEL)).toBeInTheDocument();
    });

    it('falls back for empty composition', (): void => {
        vi.mocked(usePrivateMode).mockReturnValue({
            privateMode: false,
            togglePrivateMode: vi.fn()
        });

        renderWithTheme(<SubEventView subEvent={createSubevent({ composition: '' })} />);

        expect(screen.getByText(EVENT_ITEM_COMPOSITION_LABEL)).toBeInTheDocument();
        expect(screen.getByText(EVENT_ITEM_EMPTY_COMPOSITION_TEXT)).toBeInTheDocument();
    });

    it('renders loco reference link when loco_ref is present', (): void => {
        vi.mocked(usePrivateMode).mockReturnValue({
            privateMode: false,
            togglePrivateMode: vi.fn()
        });

        renderWithTheme(
            <SubEventView
                subEvent={createSubevent({
                    loco: {
                        type: 'siodemki',
                        id: '1988cf65',
                        sort: '5',
                        series_no: '4E-005',
                        class_no: 'EU07-005',
                        loco_ref: createReference({ event_count: 4 })
                    }
                })}
            />
        );

        expect(screen.getByRole('link')).toHaveAttribute('href', '/loco/1988cf65');
        expect(screen.getByText('(4)')).toBeInTheDocument();
    });

    it('renders multiple places with separator', (): void => {
        vi.mocked(usePrivateMode).mockReturnValue({
            privateMode: false,
            togglePrivateMode: vi.fn()
        });

        const { container } = renderWithTheme(
            <SubEventView
                subEvent={createSubevent({
                    places: [
                        createEventPlace({ text: 'Poznań' }),
                        createEventPlace({ text: '->' }),
                        createEventPlace({ text: 'Wrocław' })
                    ]
                })}
            />
        );

        expect(container).toHaveTextContent('Poznań - Wrocław');
    });

    it('hides invalid optional fields', (): void => {
        vi.mocked(usePrivateMode).mockReturnValue({
            privateMode: true,
            togglePrivateMode: vi.fn()
        });

        renderWithTheme(
            <SubEventView
                subEvent={createSubevent({
                    direction: '',
                    train: undefined,
                    info: '',
                    private_info: undefined
                })}
            />
        );

        expect(screen.queryByText(EVENT_ITEM_DIRECTION_LABEL)).not.toBeInTheDocument();
        expect(screen.queryByText('Pociąg')).not.toBeInTheDocument();
        expect(screen.queryByText('Info')).not.toBeInTheDocument();
        expect(screen.queryByText('Notatka osobista')).not.toBeInTheDocument();
    });

    it('hides private note when private mode is disabled', (): void => {
        vi.mocked(usePrivateMode).mockReturnValue({
            privateMode: false,
            togglePrivateMode: vi.fn()
        });

        renderWithTheme(
            <SubEventView
                subEvent={createSubevent({
                    private_info: 'sekretna notatka'
                })}
            />
        );

        expect(screen.queryByText('Notatka osobista')).not.toBeInTheDocument();
        expect(screen.queryByText('sekretna notatka')).not.toBeInTheDocument();
    });

    it('renders private note when private mode is enabled', (): void => {
        vi.mocked(usePrivateMode).mockReturnValue({
            privateMode: true,
            togglePrivateMode: vi.fn()
        });

        renderWithTheme(
            <SubEventView
                subEvent={createSubevent({
                    private_info: 'sekretna notatka'
                })}
            />
        );

        expect(screen.getByText('Notatka osobista')).toBeInTheDocument();
        expect(screen.getByText('sekretna notatka')).toBeInTheDocument();
    });
});
