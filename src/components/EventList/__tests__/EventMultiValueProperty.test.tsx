import { screen } from '@testing-library/react';
import { EventMultiValueProperty } from '../EventMultiValueProperty';
import { renderWithTheme } from '../../../test/renderWithTheme';

describe('EventMultiValueProperty', (): void => {
    it('returns null when all values are invalid', (): void => {
        const { container } = renderWithTheme(
            <EventMultiValueProperty
                label={{ text: 'Miejsce' }}
                values={[{ text: '' }, { text: '<-' }]}
                separator=" / "
            />
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('renders filtered values with separator', (): void => {
        renderWithTheme(
            <EventMultiValueProperty
                label={{ text: 'Miejsce' }}
                values={[{ text: 'A' }, { text: '->' }, { text: 'B' }]}
                separator=" / "
            />
        );

        expect(screen.getByText('A')).toBeInTheDocument();
        expect(screen.getByText('B')).toBeInTheDocument();
        expect(screen.getAllByText('/')).toHaveLength(1);
        expect(screen.queryByText('->')).not.toBeInTheDocument();
    });

    it('renders label and single valid value without separator', (): void => {
        renderWithTheme(
            <EventMultiValueProperty
                label={{ text: 'Miejsce' }}
                values={[{ text: '' }, { text: 'Poznań' }]}
                separator=" / "
            />
        );

        expect(screen.getByText('Miejsce')).toBeInTheDocument();
        expect(screen.getByText('Poznań')).toBeInTheDocument();
        expect(screen.queryByText('/')).not.toBeInTheDocument();
    });

    it('keeps value order after filtering invalid entries', (): void => {
        const { container } = renderWithTheme(
            <EventMultiValueProperty
                label={{ text: 'Miejsce' }}
                values={[
                    { text: 'A' },
                    { text: '<-' },
                    { text: 'B' },
                    { text: '->' },
                    { text: 'C' }
                ]}
                separator=" / "
            />
        );

        expect(container).toHaveTextContent('A / B / C');
    });
});
