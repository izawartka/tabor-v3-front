import type { JSX } from 'react';
import styled from 'styled-components';

export const ASYNC_STATE_LOADING_TEXT = 'Ładowanie...';
export const ASYNC_STATE_EMPTY_TEXT = 'Brak danych.';
export const ASYNC_STATE_RETRY_LABEL = 'Spróbuj ponownie';

const Container = styled.div`
    background: ${({ theme }): string => theme.colors.surface};
    border: 1px solid ${({ theme }): string => theme.colors.border};
    border-radius: ${({ theme }): string => theme.radii.md};
    padding: 24px;
    text-align: center;
    color: ${({ theme }): string => theme.colors.secondaryText};
`;

const LoadingWrap = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 10px;
`;

const Spinner = styled.span`
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid ${({ theme }): string => theme.colors.border};
    border-top-color: ${({ theme }): string => theme.colors.accent};
    animation: spin 0.8s linear infinite;

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;

const ErrorText = styled.p`
    margin: 0 0 12px;
    color: ${({ theme }): string => theme.colors.danger};
`;

const RetryButton = styled.button`
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid ${({ theme }): string => theme.colors.border};
    background: ${({ theme }): string => theme.colors.surface};
    cursor: pointer;
`;

export const LoadingState = ({
    text = ASYNC_STATE_LOADING_TEXT
}: {
    text?: string;
}): JSX.Element => (
    <Container>
        <LoadingWrap>
            <Spinner aria-hidden="true" />
            <span>{text}</span>
        </LoadingWrap>
    </Container>
);

export const InlineLoadingState = ({
    text = ASYNC_STATE_LOADING_TEXT
}: {
    text?: string;
}): JSX.Element => (
    <LoadingWrap>
        <Spinner aria-hidden="true" />
        <span>{text}</span>
    </LoadingWrap>
);

export const EmptyState = ({ text = ASYNC_STATE_EMPTY_TEXT }: { text?: string }): JSX.Element => (
    <Container>{text}</Container>
);

export const ErrorState = ({
    message,
    onRetry
}: {
    message: string;
    onRetry?: () => void;
}): JSX.Element => (
    <Container role="alert">
        <ErrorText>{message}</ErrorText>
        {onRetry ? <RetryButton onClick={onRetry}>{ASYNC_STATE_RETRY_LABEL}</RetryButton> : null}
    </Container>
);
