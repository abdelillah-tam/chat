import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth.service';
import {
  CHECK_TOKEN_IF_VALID,
  errorAction,
  FIND_USERS,
  GET_ALL_USERS_IN_CONTACT,
  loginAction,
  LOGIN,
  loginResultAction,
  resultOfTokenCheckingAction,
  SIGNUP,
  UPDATE_USER_INFO,
  UPLOAD_PROFILE_PICTURE,
  GET_CURRENT_LOGGEDIN_USER,
  retrievedCurrentLoggedInUserAction,
  GET_USER_BY_OBJECT_ID,
  retrievedUsersAction,
  retrievedUserAction,
  retrievedProfilePictureUrlAction,
} from './auth.actions';
import {
  catchError,
  concatAll,
  debounceTime,
  exhaustMap,
  forkJoin,
  from,
  lastValueFrom,
  map,
  of,
  switchMap,
} from 'rxjs';
import { User } from '../../model/user';
import { MessagingService } from '../../services/messaging.service';

@Injectable()
export class AuthEffects {
  login$;
  signup$;
  tokenValid$;
  getCurrentLoggedInUser$;
  getUserByObjectId$;
  getAllUsers$;
  findUsers$;
  uploadProfilePicture$;
  updateUserInfo$;

  constructor(
    private action$: Actions,
    private authService: AuthService,
    private messagingService: MessagingService
  ) {
    this.login$ = createEffect(() =>
      this.action$.pipe(
        ofType(LOGIN),
        exhaustMap((value: { email: string; password: string }) =>
          this.authService.login(value.email, value.password).pipe(
            map((data) =>
              loginResultAction({
                email: data.email,
                objectId: data.objectId,
                userToken: data.userToken,
              })
            ),
            catchError(() => of(errorAction()))
          )
        )
      )
    );

    this.signup$ = createEffect(() =>
      this.action$.pipe(
        ofType(SIGNUP),
        exhaustMap(
          (value: { user: User; password: string; provider: string }) =>
            this.authService
              .signUp(value.user, value.password, value.provider)
              .pipe(
                map(() =>
                  loginAction({
                    email: value.user.email,
                    password: value.password,
                  })
                ),
                catchError(() => of(errorAction()))
              )
        )
      )
    );

    this.tokenValid$ = createEffect(() =>
      this.action$.pipe(
        ofType(CHECK_TOKEN_IF_VALID),
        exhaustMap((value: { token: string }) =>
          this.authService.verifyIfTokenValid(value.token).pipe(
            map((valid) => resultOfTokenCheckingAction({ valid: valid })),
            catchError(() => of(errorAction()))
          )
        )
      )
    );

    this.getCurrentLoggedInUser$ = createEffect(() =>
      this.action$.pipe(
        ofType(GET_CURRENT_LOGGEDIN_USER),
        exhaustMap((value: { objectId: string }) =>
          this.authService.findUserByObjectId(value.objectId).pipe(
            map((data) =>
              retrievedCurrentLoggedInUserAction({ currentUserLoggedIn: data })
            ),
            catchError(() => of(errorAction()))
          )
        )
      )
    );

    this.getUserByObjectId$ = createEffect(() =>
      this.action$.pipe(
        ofType(GET_USER_BY_OBJECT_ID),
        exhaustMap((value: { objectId: string }) =>
          this.authService.findUserByObjectId(value.objectId).pipe(
            map((data) => retrievedUserAction({ user: data })),
            catchError(() => of(errorAction()))
          )
        )
      )
    );

    this.getAllUsers$ = createEffect(() =>
      this.action$.pipe(
        ofType(GET_ALL_USERS_IN_CONTACT),
        exhaustMap(() =>
          from(this.messagingService.getUsers()).pipe(
            switchMap((value) => {
              return this.authService.findUsersByObjectId(value).pipe(
                map((data) => retrievedUsersAction({ users: data })),
                catchError(() => of(errorAction()))
              );
            })
          )
        )
      )
    );

    this.findUsers$ = createEffect(() =>
      this.action$.pipe(
        debounceTime(500),
        ofType(FIND_USERS),
        exhaustMap((value: { name: string }) =>
          this.authService.findUsersByName(value.name).pipe(
            map((data) => retrievedUsersAction({ users: data })),
            catchError(() => of(errorAction()))
          )
        )
      )
    );

    this.uploadProfilePicture$ = createEffect(() =>
      this.action$.pipe(
        ofType(UPLOAD_PROFILE_PICTURE),
        exhaustMap((value: { file: File; user: string }) =>
          from(
            this.authService.uploadImageProfile(value.file, value.user)
          ).pipe(
            map((result) => retrievedProfilePictureUrlAction({ url: result }))
          )
        )
      )
    );

    this.updateUserInfo$ = createEffect(
      () =>
        this.action$.pipe(
          ofType(UPDATE_USER_INFO),
          exhaustMap(
            (value: {
              objectId: string;
              firstName: string | undefined;
              lastName: string | undefined;
              email: string | undefined;
              password: string | undefined;
              profileImageLink: string;
            }) =>
              this.authService.updateInfos(
                value.objectId,
                value.firstName,
                value.lastName,
                value.email,
                value.password,
                value.profileImageLink
              )
          )
        ),
      {
        dispatch: false,
      }
    );
  }
}
