import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import authApi from '../apis/authApi';
import userApi from '../apis/userApi';

import type { User } from '../types/userTypes';

const initialState: User = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  profilePicURL: undefined,
  isVerified: false,
  faEnabled: false,
  gender: '',
  dateOfBirth: '',
  language: 'en',
  timeZone: 'UTC',
  isActivityTracked: false,
  isDataShared: false,
  isEmailNotified: true,
  isSecurityNotified: true,
  isUpdateNotified: true,
  sessions: []
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(
        authApi.endpoints.login.matchFulfilled,
        authApi.endpoints.signup.matchFulfilled,
        authApi.endpoints.googlelogin.matchFulfilled
      ), (state, action) => {
        const userData = action.payload.data.user;

        state.firstName = userData.firstName;
        state.lastName = userData.lastName;
        state.username = userData.username;
        state.email = userData.email;
        state.profilePicURL = userData.profilePicURL;
        state.isVerified = userData.isVerified;
        state.faEnabled = userData.faEnabled;
        state.gender = userData.gender
        state.dateOfBirth = userData.dateOfBirth;
        state.language = userData.language;
        state.timeZone = userData.timeZone;
        state.isActivityTracked = userData.isActivityTracked;
        state.isDataShared = userData.isDataShared;
        state.isEmailNotified = userData.isEmailNotified;
        state.isSecurityNotified = userData.isSecurityNotified;
        state.isUpdateNotified = userData.isUpdateNotified;
        state.sessions = userData.sessions;
      }
    ).addMatcher(isAnyOf(
        authApi.endpoints.logout.matchFulfilled,
        authApi.endpoints.logout.matchRejected
      ), (state) => {
        Object.assign(state, initialState);
      }
    ).addMatcher(
      userApi.endpoints.updatePicture.matchFulfilled,
      (state, action) => {
        if (state.profilePicURL !== undefined) {
          state.profilePicURL = action.payload.data;
        }
      }
    );
  }
});

export const {} = userSlice.actions;
export default userSlice.reducer;