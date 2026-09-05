/**
 * Types with no single owning domain: the envelope every backend response is
 * wrapped in, and the general UI state the app keeps for itself.
 */

/**
 * Shape of every API response — see `shared/common/ApiResponse.java`.
 *
 * `error` is a machine-readable code (`NOT_FOUND`, `EMAIL_NOT_VERIFIED`, ...)
 * and is only present on a failure, where `data` is omitted.
 */
export interface ApiEnvelope<T> {
    message: string;
    data: T;
    error?: string;
}

/** Responses that carry a message and no payload — sign-out, password-forget. */
export type ApiMessage = Omit<ApiEnvelope<never>, 'data'>;

export type Theme = 'light' | 'dark' | 'system';

/** `state.gen` — preferences that are not tied to an account. */
export interface GenState {
    theme: Theme;
}
