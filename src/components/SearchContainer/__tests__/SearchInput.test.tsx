import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SEARCH_INPUT_ARIA_LABEL, SearchInput } from '../SearchInput';
import { renderWithTheme } from '../../../test/renderWithTheme';

describe('SearchInput', (): void => {
    it('renders with aria label and propagates changes', async (): Promise<void> => {
        const onChange = vi.fn();
        renderWithTheme(<SearchInput query="x" onChange={onChange} placeholder="Szukaj" />);

        const input = screen.getByRole('searchbox', { name: SEARCH_INPUT_ARIA_LABEL });
        expect(input).toHaveAttribute('placeholder', 'Szukaj');

        await userEvent.clear(input);
        await userEvent.type(input, 'ET22');

        expect(onChange).toHaveBeenLastCalledWith('ET22');
    });
});
