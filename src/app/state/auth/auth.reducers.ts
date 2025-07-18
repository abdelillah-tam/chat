import { createReducer, on } from '@ngrx/store';
import {
  emptyStateAction,
  errorAction,
  retrievedCurrentLoggedInUserAction,
  retrievedUserAction,
  retrievedUsersAction,
  retrievedTokenCheckingAction,
  retrievedFoundUserByEmailAction,
  retrievedProfilePictureAction,
} from './auth.actions';
import { AuthState } from './auth-state';

export const initialState: AuthState = {
  state: 'none',
  currentLoggedInUser: undefined,
  userInContact: undefined,
  foundUsers: [],
  tokenValidation: undefined,
  currentProfilePictureLink: undefined,
  foundUserByEmail: undefined,
};

export const authReducer = createReducer(
  initialState,
  on(errorAction, (state, data) => {
    if (data.code === 4044) {
      return { ...state, foundUsers: [] };
    }
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
      foundUserByEmail: undefined
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
  on(retrievedProfilePictureAction, (state, data) => {
    return { ...state, currentProfilePictureLink: new String(data.link) };
  }),
  on(retrievedFoundUserByEmailAction, (state, data) => {
    return { ...state, foundUserByEmail: data.data };
  })
);
