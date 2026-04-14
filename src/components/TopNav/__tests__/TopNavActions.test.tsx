import { screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { TopNavActions } from '../TopNavActions';
import { renderWithTheme } from '../../../test/renderWithTheme';

vi.mock('../PrivateModeToggle', () => ({
    PrivateModeToggle: (): ReactElement => <button>private-mode-toggle</button>
}));

vi.mock('../SchemeToggle', () => ({
    SchemeToggle: (): ReactElement => <button>scheme-toggle</button>
}));

describe('TopNavActions', (): void => {
    it('renders both actions in desktop variant', (): void => {
        renderWithTheme(<TopNavActions />);

        expect(screen.getByRole('button', { name: 'private-mode-toggle' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'scheme-toggle' })).toBeInTheDocument();
    });
});
