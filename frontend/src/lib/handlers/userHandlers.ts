import baseHandler from './baseHandler';

import type { ApiEnvelope, ApiMessage } from '../models/genModels';
import type {
    AuthenticatedUser,
    GoogleSignInRequest,
    PassForgetRequest,
    PassResetRequest,
    SignInRequest,
    SignUpRequest,
    UpdatePictureRequest,
    VerifyEmailRequest,
} from '../models/userModels';

/**
 * The user domain: identity, sessions and the profile.
 *
 * Endpoints are injected into the shared API from `baseHandler`, so they land in
 * the same cache and behind the same re-auth handling as every other domain.
 *
 * The responses are unwrapped here — components get the `data` payload (or the
 * message, where there is no payload) rather than the envelope.
 */

const unwrap = <T>(response: ApiEnvelope<T>): T => response.data;
const messageOf = (response: ApiMessage): string => response.message;

export const userHandlers = baseHandler.injectEndpoints({
    endpoints: (builder) => ({
        signIn: builder.mutation<AuthenticatedUser, SignInRequest>({
            query: (credentials) => ({
                url: '/auth/sign-in',
                method: 'POST',
                body: credentials,
            }),
            transformResponse: unwrap<AuthenticatedUser>,
            invalidatesTags: ['User', 'Session'],
        }),
        signUp: builder.mutation<AuthenticatedUser, SignUpRequest>({
            query: (details) => ({
                url: '/auth/sign-up',
                method: 'POST',
                body: details,
            }),
            transformResponse: unwrap<AuthenticatedUser>,
        }),
        googleSignIn: builder.mutation<AuthenticatedUser, GoogleSignInRequest>({
            query: (body) => ({
                url: '/auth/google',
                method: 'POST',
                body,
            }),
            transformResponse: unwrap<AuthenticatedUser>,
            invalidatesTags: ['User', 'Session'],
        }),
        signOut: builder.mutation<string, void>({
            query: () => ({
                url: '/auth/sign-out',
                method: 'POST',
            }),
            transformResponse: messageOf,
            invalidatesTags: ['User', 'Session'],
        }),
        refresh: builder.mutation<AuthenticatedUser, void>({
            query: () => ({
                url: '/auth/refresh',
                method: 'POST',
            }),
            transformResponse: unwrap<AuthenticatedUser>,
            invalidatesTags: ['User', 'Session'],
        }),
        verifyEmail: builder.mutation<AuthenticatedUser, VerifyEmailRequest>({
            query: ({ token }) => ({
                url: '/auth/email-verify',
                method: 'POST',
                params: { token },
            }),
            transformResponse: unwrap<AuthenticatedUser>,
            invalidatesTags: ['User'],
        }),
        forgotPassword: builder.mutation<string, PassForgetRequest>({
            query: (body) => ({
                url: '/auth/password-forget',
                method: 'POST',
                body,
            }),
            transformResponse: messageOf,
        }),
        resetPassword: builder.mutation<AuthenticatedUser, PassResetRequest>({
            query: (body) => ({
                url: '/auth/password-reset',
                method: 'POST',
                body,
            }),
            transformResponse: unwrap<AuthenticatedUser>,
            invalidatesTags: ['User', 'Session'],
        }),
        updatePicture: builder.mutation<string, UpdatePictureRequest>({
            query: ({ picture }) => {
                const body = new FormData();
                body.append('picture', picture);

                return { url: '/users/me/picture', method: 'PUT', body };
            },
            transformResponse: unwrap<string>,
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useSignInMutation,
    useSignUpMutation,
    useGoogleSignInMutation,
    useSignOutMutation,
    useRefreshMutation,
    useVerifyEmailMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useUpdatePictureMutation,
} = userHandlers;

export default userHandlers;
