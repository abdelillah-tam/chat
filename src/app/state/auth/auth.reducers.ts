import { createReducer, on } from '@ngrx/store';
import {
  emptyStateAction,
  errorAction,
  retrievedCurrentLoggedInUserAction,
  retrievedProfilePictureUrlAction,
  retrievedUserAction,
  retrievedUsersAction,
  loginResultAction,
  resultOfTokenCheckingAction,
} from './auth.actions';
import { AuthState } from './auth-state';



export const initialState: AuthState = {
  state: 'none',
  userData: undefined,
  validToken: undefined,
  currentLoggedInUser: undefined,
  userInContact: undefined,
  foundUsers: [],
  newProfilePictureUrl: '',
};


export const authReducer = createReducer(
  initialState,
  on(loginResultAction, (state, data) => {
    return {
      ...state,
      state: 'success',
      userData: {
        email: data.email,
        userToken: data.userToken,
        objectId: data.objectId,
      },
    };
  }),
  on(errorAction, (state) => {
    return { ...state, state: 'failed' };
  }),
  on(emptyStateAction, (state) => {
    return {
      ...state,
      state: 'none',
      userData: undefined,
      userInContact: undefined,
      newProfilePictureUrl: '',
      foundUsers: [],
      validToken: undefined,
      currentLoggedInUser: undefined
    };
  }),
  on(retrievedCurrentLoggedInUserAction, (state, data) => {
    return { ...state, currentLoggedInUser: data.currentUserLoggedIn };
  }),
  on(retrievedUserAction, (state, data) => {
    return { ...state, userInContact: data.user };
  }),
  on(retrievedUsersAction, (state, data) => {
    return { ...state, foundUsers: data.users };
  }),
  on(resultOfTokenCheckingAction, (state, data) => {
    return { ...state, validToken: data.valid };
  }),
  on(retrievedProfilePictureUrlAction, (state, data) => {
    return { ...state, newProfilePictureUrl: data.url };
  })
);

