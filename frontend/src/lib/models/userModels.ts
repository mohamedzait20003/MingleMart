export type Role = string | null;
export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';

export interface AuthenticatedUser {
    id: string;
    username: string;
    email: string;
    displayName: string;
    role: Role;
    verified: boolean;
    publicUserId: string | null;
}

/** One signed-in device, as listed under Profile → Security. */
export interface UserSession {
    deviceType: string;
    location: string;
    deviceOS: string;
    lastUsedAt: string;
}

export interface UserProfile {
    isActivityTracked: boolean;
    isDataShared: boolean;
    isEmailNotified: boolean;
    isSecurityNotified: boolean;
    isUpdateNotified: boolean;
}

export interface UserState {
    id: string | null;
    publicUserId: string | null;

    role: Role;
    isVerified: boolean;
    isAuthenticated: boolean;
    

    firstName: string;
    lastName: string;
    displayName: string;
    username: string;
    email: string;

    profilePicURL?: string;

    faEnabled: boolean;
    gender?: Gender;

    locale: string;
    timeZone: string;
    dateOfBirth: string;

    // --- profile ---
    customerProfile?: UserProfile;
}

// --- requests ---

export interface SignInRequest {
    email: string;
    password: string;
}

export interface SignUpRequest {
    fname: string;
    lname: string;
    username: string;
    email: string;
    password: string;
    gender?: Gender;
    dateOfBirth: string;
}

export interface GoogleSignInRequest {
    idToken: string;
}

export interface VerifyEmailRequest {
    token: string;
}

export interface PassForgetRequest {
    email: string;
}

export interface PassResetRequest {
    token: string;
    password: string;
    passwordConfirmation: string;
}

export interface UpdatePictureRequest {
    picture: File;
}
