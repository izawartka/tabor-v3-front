import { screen } from '@testing-library/react';
import { HeaderProperty } from '../HeaderProperty';
import { renderWithTheme } from '../../../test/renderWithTheme';
import { createReference } from '../../../test/factories/api';

describe('HeaderProperty', (): void => {
    it('returns null for empty values', (): void => {
        const { container } = renderWithTheme(<HeaderProperty label="L" value="" />);

        expect(container).toBeEmptyDOMElement();
    });

    it('renders plain value', (): void => {
        renderWithTheme(<HeaderProperty label="L" value="V" />);

        expect(screen.getByText('L')).toBeInTheDocument();
        expect(screen.getByText('V')).toBeInTheDocument();
    });

    it('renders linked reference', (): void => {
        renderWithTheme(
            <HeaderProperty
                label="Grupa"
                value="dragony"
                reference={{
                    ref: createReference(),
                    href: '/type/dragony',
                    refText: 'Zobacz wszystkie pojazdy z tej grupy'
                }}
            />
        );

        expect(screen.getByRole('link')).toHaveAttribute('href', '/type/dragony');
    });
});
