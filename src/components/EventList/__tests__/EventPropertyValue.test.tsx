import { screen } from '@testing-library/react';
import { EventPropertyValue } from '../EventPropertyValue';
import { renderWithTheme } from '../../../test/renderWithTheme';
import { createReference } from '../../../test/factories/api';

describe('EventPropertyValue', (): void => {
    it('renders placeholder when text is missing', (): void => {
        renderWithTheme(<EventPropertyValue />);

        expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('renders placeholder when text is empty string', (): void => {
        renderWithTheme(<EventPropertyValue text="" />);

        expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('renders plain text', (): void => {
        renderWithTheme(<EventPropertyValue text="E6ACTadb-043" />);

        expect(screen.getByText('E6ACTadb-043')).toBeInTheDocument();
    });

    it('renders link with reference counter', (): void => {
        renderWithTheme(
            <EventPropertyValue
                text="E6ACTadb-043"
                refData={{ ref: createReference({ event_count: 7 }), href: '/loco/d6a9d19a' }}
            />
        );

        expect(screen.getByRole('link')).toHaveAttribute('href', '/loco/d6a9d19a');
        expect(screen.getByText('(7)')).toBeInTheDocument();
    });

    it('renders reference count for different values', (): void => {
        renderWithTheme(
            <EventPropertyValue
                text="SM42-1001"
                refData={{ ref: createReference({ event_count: 1 }), href: '/loco/sm42-1001' }}
            />
        );

        expect(screen.getByText('(1)')).toBeInTheDocument();
    });
});
