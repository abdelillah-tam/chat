import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import {
  selectCurrentLoggedInUser,
  selectFoundUsers,
  selectState,
  selectTokenValidation,
  selectUser,
} from './auth.selectors';
import { AuthState } from './auth-state';
import { User } from '../../model/user';

describe('Auth Selectors', () => {
  let mockUser: User = {
    firstName: 'Abdelillah',
    lastName: 'Tamoussat',
    email: 'a@a.com',
    objectId: 'id',
    profileImageLink: 'images.google.com',
    provider: 'google',
    sex: 'man',
  };

  let mockUserOne: User = {
    firstName: 'Mohamed',
    lastName: 'Haltout',
    email: 'a@a.com',
    objectId: 'id',
    profileImageLink: 'images.google.com',
    provider: 'google',
    sex: 'man',
  };

  let mockUserInContact: User = {
    firstName: 'Mohamed',
    lastName: 'Haltout',
    email: 'a@a.com',
    objectId: 'id',
    profileImageLink: 'images.google.com',
    provider: 'google',
    sex: 'man',
  };

  const authState: AuthState = {
    foundUsers: [mockUserOne],
    currentLoggedInUser: mockUser,
    validToken: true,
    newProfilePictureUrl: 'google.com',
    state: 'error',
    userData: {
      email: 'b@b.com',
      objectId: 'objid',
      userToken: 'token',
    },
    userInContact: mockUserInContact,
  };
  it('should select state', () => {
    const result = selectState.projector(authState);

    expect(result).toBeTruthy();
    expect(result).toEqual(authState);
  });

  it('should select current user logged in', () => {
    const result = selectCurrentLoggedInUser.projector(authState);

    expect(result).toBeTruthy();
    expect(result).toBe(authState.currentLoggedInUser);
  });

  it('should select found users', () => {
    const result = selectFoundUsers.projector(authState);

    expect(result).toBeTruthy();
    expect(result).toBe(authState.foundUsers);
  });

  it('should select user in contact', () => {
    const result = selectUser.projector(authState);

    expect(result).toBe(authState.userInContact);
  });

  it('should select token validation', () => {
    const result = selectTokenValidation.projector(authState);

    expect(result).toBeTrue();
  });
});
