// User Types
export interface Session {
  deviceType: string;
  location: string;
  deviceOS: string;
  lastUsedAt: string;
}

export interface User {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profilePicURL?: string;
  isVerified: boolean;
  faEnabled: boolean;
  gender: string;
  dateOfBirth: string;
  language: string;
  timeZone: string;
  isActivityTracked: boolean;
  isDataShared: boolean;
  isEmailNotified: boolean;
  isSecurityNotified: boolean;
  isUpdateNotified: boolean;
  sessions?: Session[];
}


// Profile Picture Update Types

export interface UpdatePictureRequest {
  picture: File;
}

export interface UpdatePictureResponse {
  message: string;
  data: string;
}