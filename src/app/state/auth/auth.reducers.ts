import { createReducer, on } from '@ngrx/store';
import {
  emptyStateAction,
  errorAction,
  retrievedCurrentLoggedInUserAction,
  retrievedUserAction,
  retrievedUsersAction,
  retrievedTokenCheckingAction,
  retrievedProfilePictureLinkAction,
} from './auth.actions';
import { AuthState } from './auth-state';
import { User } from '../../model/user';

export const initialState: AuthState = {
  state: 'none',
  currentLoggedInUser: undefined,
  userInContact: undefined,
  foundUsers: [],
  tokenValidation: undefined,
  currentProfilePictureLink: undefined,
};

export const authReducer = createReducer(
  initialState,
  on(errorAction, (state) => {
    return { ...state, state: 'failed' };
  }),
  on(emptyStateAction, (state) => {
    return {
      ...state,
      state: 'none',
      userInContact: undefined,
      newProfilePictureUrl: '',
      foundUsers: [],
      validToken: undefined,
      currentLoggedInUser: undefined,
    };
  }),
  on(retrievedCurrentLoggedInUserAction, (state, data) => {
    return { ...state, currentLoggedInUser: data.currentUserLoggedInOrError };
  }),
  on(retrievedUserAction, (state, data) => {
    return { ...state, userInContact: data.user };
  }),
  on(retrievedUsersAction, (state, data) => {
    return { ...state, foundUsers: data.users };
  }),
  on(retrievedTokenCheckingAction, (state, data) => {
    return { ...state, tokenValidation: data.valid };
  }),
  on(retrievedProfilePictureLinkAction, (state, data) => {
    return { ...state, currentProfilePictureLink: data.link };
  })
);
