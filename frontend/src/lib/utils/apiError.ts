import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export type ApiError = FetchBaseQueryError | SerializedError | undefined;

const hasMessage = (data: unknown): data is { message: string } =>
    typeof data === 'object' &&
    data !== null &&
    'message' in data &&
    typeof (data as { message: unknown }).message === 'string';

export function apiErrorMessage(error: ApiError, fallback: string): string {
    if (!error) {
        return fallback;
    }

    if ('data' in error && hasMessage(error.data)) {
        return error.data.message;
    }

    if ('message' in error && typeof error.message === 'string') {
        return error.message;
    }

    return fallback;
}
