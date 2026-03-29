import { createReducer, on } from '@ngrx/store';
import {
  emptyStateAction,
  errorAction,
  loadLoggedInUserSuccess,
  loadUserSuccess,
  loadUsersInContactSuccess,
} from './auth.actions';
import { AuthState } from './auth-state';

export const initialState: AuthState = {
  state: 'none',
  currentLoggedInUser: undefined,
  userInContact: undefined,
  foundUsers: undefined,
  currentProfilePictureLink: undefined,
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
      state: 'none',
      userInContact: undefined,
      foundUsers: [],
      currentLoggedInUser: undefined,
      foundUserByEmail: undefined,
      currentProfilePictureLink: undefined,
    };
  }),
  on(loadLoggedInUserSuccess, (state, data) => {
    return { ...state, currentLoggedInUser: data.currentUserLoggedInOrError };
  }),
  on(loadUserSuccess, (state, data) => {
    return { ...state, userInContact: data.user };
  }),
  on(loadUsersInContactSuccess, (state, data) => {
    return { ...state, foundUsers: data.users };
  }),
);
