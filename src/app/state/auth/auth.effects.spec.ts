import { TestBed } from '@angular/core/testing';
import { Action, provideStore, Store } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { from, Observable, of, throwError } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import {
  AUTH_API_LOGIN,
  checkIfTokenIsValidAction,
  errorAction,
  getAllUsersInContactAction,
  getCurrentLoggedInUser,
  LOGIN,
  loginAction,
  loginResultAction,
  resultOfTokenCheckingAction,
  retrievedCurrentLoggedInUserAction,
  retrievedUsersAction,
  signupAction,
} from './auth.actions';
import { AuthService } from '../../services/auth.service';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './auth.effects';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { User } from '../../model/user';
import { MessagingService } from '../../services/messaging.service';
import { DataSnapshot } from 'firebase/database';
import { Data } from '@angular/router';

describe('Effects', () => {
  let actions$ = new Observable<Action>();

  let authService: AuthService;

  let messagingService: MessagingService;

  let authEffects: AuthEffects;

  let mockUser: User;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideStore({}),
        provideMockActions(() => actions$),
        {
          provide: AuthService,
          useFactory: (httpClient: HttpClient) => new AuthService(httpClient),
          deps: [HttpClient],
        },
        {
          provide: MessagingService,
          useFactory: (store: Store) => new MessagingService(store),
          deps: [Store],
        },
        provideEffects(AuthEffects),
      ],
    });

    authService = TestBed.inject(AuthService);
    messagingService = TestBed.inject(MessagingService);
    authEffects = TestBed.inject(AuthEffects);
    mockUser = {
      email: 'a@a.com',
      firstName: 'Abdelillah',
      lastName: 'Tamoussat',
      objectId: 'id',
      profileImageLink: 'link.com',
      provider: 'google',
      sex: 'man',
    };
  });

  it('should return loginResultAction with user from login effect', (done) => {
    actions$ = of({ type: LOGIN });

    let loginSpy = spyOn(authService, 'login');

    loginSpy.and.returnValue(
      of({ email: 'a@a.com', ['user-token']: 'token', objectId: 'id' })
    );

    authEffects.login$.subscribe((data) => {
      expect(data).toEqual(
        loginResultAction({
          email: 'a@a.com',
          userToken: 'token',
          objectId: 'id',
        })
      );
      done();
    });
  });

  it('should return loginAction with user data', (done) => {
    actions$ = of(
      signupAction({ user: mockUser, password: 'password', provider: 'google' })
    );
    let signupSpy = spyOn(authService, 'signUp');

    signupSpy.and.returnValue(of(mockUser));

    authEffects.signup$.subscribe((data) => {
      expect(data).toEqual(
        loginAction({ email: mockUser.email, password: 'password' })
      );

      done();
    });
  });

  it('should check for user token validation then return true', (done) => {
    actions$ = of(checkIfTokenIsValidAction({ token: 'token' }));

    let tokenSpy = spyOn(authService, 'verifyIfTokenValid');

    tokenSpy.and.returnValue(of(true));

    authEffects.tokenValid$.subscribe((data) => {
      expect(data).toEqual(resultOfTokenCheckingAction({ valid: true }));
      done();
    });
  });

  it('should verifyIfTokenValid throw error then return error action', (done) => {
    actions$ = of(checkIfTokenIsValidAction({ token: 'token' }));

    let currentUserSpy = spyOn(authService, 'verifyIfTokenValid');
    currentUserSpy.and.returnValue(throwError(() => new Error('')));

    authEffects.tokenValid$.subscribe((data) => {
      expect(data).toEqual(errorAction());
      done();
    });
  });

  it('should return retrieved action with mocking user data', (done) => {
    actions$ = of(getCurrentLoggedInUser({ objectId: 'id' }));

    let currentUserSpy = spyOn(authService, 'findUserByObjectId');
    currentUserSpy.and.returnValue(of(mockUser));

    authEffects.getCurrentLoggedInUser$.subscribe((data) => {
      expect(data).toEqual(
        retrievedCurrentLoggedInUserAction({ currentUserLoggedIn: mockUser })
      );
      done();
    });
  });

  it('should findUserByObjectId throw error then return error action', (done) => {
    actions$ = of(getCurrentLoggedInUser({ objectId: 'id' }));

    let currentUserSpy = spyOn(authService, 'findUserByObjectId');
    currentUserSpy.and.returnValue(throwError(() => new Error('')));

    authEffects.getCurrentLoggedInUser$.subscribe((data) => {
      expect(data).toEqual(errorAction());
      done();
    });
  });

  it('should return retrievedUsersAction', (done) => {
    actions$ = of(getAllUsersInContactAction());

    let mockUsers: User[] = [
      {
        email: 'a@a.com',
        firstName: 'Abdelillah',
        lastName: 'Tamoussat',
        objectId: 'id',
        profileImageLink: 'link',
        provider: 'google',
        sex: 'man',
      },
    ];

    let getUsers = spyOn(messagingService, 'getUsers');
    getUsers.and.resolveTo(['obj one', 'obj two']);

    let findUsersSpy = spyOn(authService, 'findUsersByObjectId');
    findUsersSpy.and.returnValue(of(mockUsers));

    authEffects.getAllUsers$.subscribe((data) => {
      expect(messagingService.getUsers).toHaveBeenCalled();
      expect(authService.findUsersByObjectId).toHaveBeenCalled();
      expect(data).toEqual(retrievedUsersAction({ users: mockUsers }));
      done();
    });
  });
});
