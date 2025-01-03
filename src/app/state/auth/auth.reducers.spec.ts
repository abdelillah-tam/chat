import { TestBed } from '@angular/core/testing';
import {
  emptyStateAction,
  errorAction,
  loginResultAction,
  retrievedCurrentLoggedInUserAction,
  retrievedProfilePictureUrlAction,
} from './auth.actions';
import * as fromReducer from './auth.reducers';
import { provideMockStore } from '@ngrx/store/testing';
import { User } from '../../model/user';

describe('AuthReducer', () => {
  beforeEach(() => {});

  it('should return the default state', () => {
    const { initialState } = fromReducer;

    const state = fromReducer.authReducer(initialState, { type: 'unknow' });
    expect(state).toBe(initialState);
  });

  it('should return logged in user now', () => {
    const { initialState } = fromReducer;

    let loggedInUser = {
      email: 'email',
      userToken: 'token',
      objectId: 'objectId',
    };

    const state = fromReducer.authReducer(
      initialState,
      loginResultAction(loggedInUser)
    );

    expect(state).not.toBe(initialState);

    expect(state).toEqual({
      ...state,
      userData: loggedInUser,
    });
  });

  it('should return an error', () => {
    const { initialState } = fromReducer;
    const state = fromReducer.authReducer(initialState, errorAction());

    expect(state).not.toEqual(initialState);
  });

  it('should return to initial state', () => {
    const { initialState } = fromReducer;

    const state = fromReducer.authReducer(initialState, emptyStateAction());

    expect(state).toEqual(initialState);
  });

  it('should return current user logged in', () => {
    const { initialState } = fromReducer;

    let mockUser: User = {
      firstName: 'Abdelillah',
      lastName: 'Tamoussat',
      email: 'a@a.com',
      objectId: 'id',
      profileImageLink: 'images.google.com',
      provider: 'google',
      sex: 'man',
    };

    const state = fromReducer.authReducer(
      initialState,
      retrievedCurrentLoggedInUserAction({ currentUserLoggedIn: mockUser })
    );

    expect(state).not.toEqual(initialState);
    expect(state.currentLoggedInUser).toBe(mockUser);
  });

  it('should return profile picture url', () => {
    const { initialState } = fromReducer;

    const url = 'google.com';

    const state = fromReducer.authReducer(
      initialState,
      retrievedProfilePictureUrlAction({ url: url })
    );

    expect(state.newProfilePictureUrl).toBe(url);
  });
});
