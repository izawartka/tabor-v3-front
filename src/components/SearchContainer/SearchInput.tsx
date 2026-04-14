import { useEffect, useState } from 'react';
import type { JSX } from 'react';
import styled from 'styled-components';

export const SEARCH_INPUT_ARIA_LABEL = 'Wyszukiwarka';

const SearchWrap = styled.div`
    margin-bottom: 16px;
`;

const StyledSearchInput = styled.input`
    width: 100%;
    border: 1px solid ${({ theme }): string => theme.colors.border};
    background: ${({ theme }): string => theme.colors.surface};
    color: ${({ theme }): string => theme.colors.text};
    border-radius: ${({ theme }): string => theme.radii.lg};
    padding: 12px 14px;
`;

interface SearchInputProps {
    query: string;
    onChange: (nextQuery: string) => void;
    placeholder: string;
}

export const SearchInput = ({ query, onChange, placeholder }: SearchInputProps): JSX.Element => {
    const [localQuery, setLocalQuery] = useState<string>(query);

    useEffect((): void => {
        setLocalQuery(query);
    }, [query]);

    return (
        <SearchWrap>
            <StyledSearchInput
                type="search"
                value={localQuery}
                onChange={event => {
                    const nextQuery = event.target.value;
                    setLocalQuery(nextQuery);
                    onChange(nextQuery);
                }}
                placeholder={placeholder}
                aria-label={SEARCH_INPUT_ARIA_LABEL}
                autoComplete="off"
                spellCheck={false}
            />
        </SearchWrap>
    );
};
