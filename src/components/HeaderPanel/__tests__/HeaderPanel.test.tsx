import { screen } from '@testing-library/react';
import { HeaderPanel } from '../HeaderPanel';
import { renderWithTheme } from '../../../test/renderWithTheme';

export const HEADER_PANEL_TITLE = 'EP09-011';
export const HEADER_PANEL_TYPE_LABEL = 'Nazwa typu';
export const HEADER_PANEL_TYPE_VALUE = '104Eb-011';
export const HEADER_PANEL_COUNT_LABEL = 'Liczba wpisów';
export const HEADER_PANEL_COUNT_VALUE = 4;

describe('HeaderPanel', (): void => {
    it('renders title and properties', (): void => {
        renderWithTheme(
            <HeaderPanel
                title={HEADER_PANEL_TITLE}
                properties={[
                    { label: HEADER_PANEL_TYPE_LABEL, value: HEADER_PANEL_TYPE_VALUE },
                    { label: HEADER_PANEL_COUNT_LABEL, value: HEADER_PANEL_COUNT_VALUE }
                ]}
            />
        );

        expect(screen.getByRole('heading', { name: HEADER_PANEL_TITLE })).toBeInTheDocument();
        expect(screen.getByText(HEADER_PANEL_TYPE_LABEL)).toBeInTheDocument();
        expect(screen.getByText(HEADER_PANEL_TYPE_VALUE)).toBeInTheDocument();
        expect(screen.getByText(HEADER_PANEL_COUNT_LABEL)).toBeInTheDocument();
    });
});
