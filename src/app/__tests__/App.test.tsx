import { render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { App } from '../App';

vi.mock('../AppRouter', () => ({
    AppRouter: (): ReactElement => <div>router</div>
}));

describe('App', (): void => {
    it('renders app router', (): void => {
        render(<App />);

        expect(screen.getByText('router')).toBeInTheDocument();
    });
});
