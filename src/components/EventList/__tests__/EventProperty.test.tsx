import { screen } from '@testing-library/react';
import { EventProperty } from '../EventProperty';
import { renderWithTheme } from '../../../test/renderWithTheme';
import { createReference } from '../../../test/factories/api';

describe('EventProperty', (): void => {
    it('returns null for invalid value', (): void => {
        const { container } = renderWithTheme(
            <EventProperty label={{ text: 'L' }} value={{ text: '' }} />
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('renders valid property', (): void => {
        renderWithTheme(<EventProperty label={{ text: 'L' }} value={{ text: 'V' }} />);

        expect(screen.getByText('L')).toBeInTheDocument();
        expect(screen.getByText('V')).toBeInTheDocument();
    });

    it('returns null for arrow marker values', (): void => {
        const { container } = renderWithTheme(
            <EventProperty label={{ text: 'L' }} value={{ text: '->' }} />
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('returns null for undefined value', (): void => {
        const { container } = renderWithTheme(<EventProperty label={{ text: 'L' }} value={{}} />);

        expect(container).toBeEmptyDOMElement();
    });

    it('renders reference link when value has refData', (): void => {
        renderWithTheme(
            <EventProperty
                label={{ text: 'L' }}
                value={{
                    text: 'EU07-005',
                    refData: { ref: createReference({ event_count: 12 }), href: '/loco/1988cf65' }
                }}
            />
        );

        expect(screen.getByRole('link')).toHaveAttribute('href', '/loco/1988cf65');
        expect(screen.getByText('(12)')).toBeInTheDocument();
    });
});
